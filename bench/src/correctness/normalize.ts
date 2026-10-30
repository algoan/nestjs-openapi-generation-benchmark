/**
 * Normalization of an OpenAPI document (2.0-free, 3.0 or 3.1) into a canonical, `$ref`-free form,
 * so that two documents describing the same API compare equal whatever the tool's style:
 * inlined vs referenced schemas, `allOf` inheritance, `oneOf` vs `anyOf`, 3.0 `nullable` vs 3.1 `type: [..., 'null']`, etc.
 */

export type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const HTTP_METHODS: string[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

/** Canonical schema */
export interface Schema {
  types: string[]; // sorted, without 'null'; empty = any
  nullable: boolean;
  format?: string;
  enum?: unknown[];
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: Schema;
  items?: Schema;
  anyOf?: Schema[];
  constraints: Record<string, unknown>;
  description?: string;
  unresolved?: string;
}

export interface Parameter {
  name: string;
  in: string;
  required: boolean;
  description?: string;
  schema: Schema;
}

export interface MediaContent {
  [mediaType: string]: Schema;
}

export interface Operation {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  secured: boolean;
  parameters: Parameter[];
  requestBody?: { required: boolean; content: MediaContent };
  responses: Record<string, { content: MediaContent }>;
}

export interface NormalizedDocument {
  version: string;
  operations: Operation[];
  /** Global path prefix the comparator had to add, if any */
  addedPrefix?: string;
}

const CONSTRAINT_KEYWORDS: string[] = [
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'minLength',
  'maxLength',
  'pattern',
  'minItems',
  'maxItems',
  'uniqueItems',
  'minProperties',
  'maxProperties',
  'default',
];

const NUMERIC_FORMATS: string[] = ['int32', 'int64', 'float', 'double'];

const anySchema = (): Schema => ({ types: [], nullable: false, constraints: {} });

export class Normalizer {
  private readonly doc: Json;
  private readonly isOas30: boolean;

  /** `oas30` reads `nullable`, as in OpenAPI 3.0 schemas (an AsyncAPI payload may use that schema format) */
  constructor(doc: Json, oas30: boolean = typeof doc.openapi === 'string' && doc.openapi.startsWith('3.0')) {
    this.doc = doc;
    this.isOas30 = oas30;
  }

  public resolveRef(node: Json, seen: Set<string> = new Set()): { node: Json; refs: Set<string> } {
    let current: Json = node;
    const refs: Set<string> = new Set(seen);
    while (current !== null && typeof current === 'object' && typeof current.$ref === 'string') {
      const ref: string = current.$ref;
      if (refs.has(ref)) {
        return { node: { 'x-cycle': ref }, refs };
      }
      refs.add(ref);
      const siblings: Json = { ...current };
      delete siblings.$ref;
      const target: Json = this.pointer(ref);
      // 3.1 allows siblings beside $ref: keep them (description mostly)
      current = Object.keys(siblings).length > 0 ? { allOf: [target], ...siblings } : target;
    }

    return { node: current, refs };
  }

  private pointer(ref: string): Json {
    if (!ref.startsWith('#/')) {
      return { 'x-unresolved': ref };
    }
    const target: Json = ref
      .slice(2)
      .split('/')
      .map((part: string): string => decodeURIComponent(part).replace(/~1/g, '/').replace(/~0/g, '~'))
      .reduce((acc: Json, key: string): Json => (acc === undefined || acc === null ? undefined : acc[key]), this.doc);

    return target ?? { 'x-unresolved': ref };
  }

  /** Normalize any JSON schema node */
  public schema(input: Json, seen: Set<string> = new Set()): Schema {
    if (input === undefined || input === null || input === true) {
      return anySchema();
    }
    if (input === false) {
      return { ...anySchema(), unresolved: 'false' };
    }
    const { node, refs } = this.resolveRef(input, seen);
    if (node === undefined || node === null || typeof node !== 'object') {
      return anySchema();
    }
    if (node['x-cycle'] !== undefined) {
      return { ...anySchema(), unresolved: `cycle:${node['x-cycle']}` };
    }

    // allOf: merge every branch into the node itself
    if (Array.isArray(node.allOf)) {
      const rest: Json = { ...node };
      delete rest.allOf;
      const branches: Schema[] = [...node.allOf.map((b: Json): Schema => this.schema(b, refs))];
      const own: Schema = this.schema(rest, refs);

      const merged: Schema = [...branches, own].reduce(mergeSchemas);
      // 3.0 idiom: `allOf: [$ref], nullable: true`
      merged.nullable = merged.nullable || own.nullable;

      return merged;
    }

    const out: Schema = anySchema();
    if (typeof node.description === 'string' && node.description.trim() !== '') {
      out.description = node.description;
    }
    if (node['x-unresolved'] !== undefined) {
      out.unresolved = String(node['x-unresolved']);
    }

    // union: anyOf / oneOf
    const union: Json[] | undefined = node.anyOf ?? node.oneOf;
    if (Array.isArray(union)) {
      let branches: Schema[] = union.map((b: Json): Schema => this.schema(b, refs));
      const hasNull: boolean = branches.some(isNullOnly);
      branches = branches.filter((b: Schema): boolean => !isNullOnly(b));
      branches = mergeEnumBranches(branches);
      if (branches.length === 1) {
        const single: Schema = { ...branches[0], nullable: branches[0].nullable || hasNull };
        single.description = out.description ?? single.description;

        return single;
      }
      out.anyOf = branches;
      out.nullable = hasNull || node.nullable === true;

      return out;
    }

    // types
    let types: string[] = Array.isArray(node.type) ? node.type : node.type !== undefined ? [node.type] : [];
    if (types.includes('null')) {
      out.nullable = true;
      types = types.filter((t: string): boolean => t !== 'null');
    }
    if (this.isOas30 && node.nullable === true) {
      out.nullable = true;
    }
    if (node.const !== undefined) {
      out.enum = [node.const];
    }
    if (Array.isArray(node.enum)) {
      const values: unknown[] = node.enum.filter((v: unknown): boolean => v !== null);
      if (values.length !== node.enum.length) {
        out.nullable = true;
      }
      out.enum = values;
    }
    if (types.length === 0 && out.enum !== undefined && out.enum.length > 0) {
      types = [...new Set(out.enum.map((v: unknown): string => (typeof v === 'number' ? 'number' : typeof v)))];
    }
    if (types.length === 0 && (node.properties !== undefined || node.additionalProperties !== undefined)) {
      types = ['object'];
    }
    if (types.length === 0 && node.items !== undefined) {
      types = ['array'];
    }
    out.types = [...new Set(types)].sort();

    // `int32`, `int64`, `float` and `double` only hint at the binary representation of a number
    if (typeof node.format === 'string' && !NUMERIC_FORMATS.includes(node.format)) {
      out.format = node.format;
    }
    for (const keyword of CONSTRAINT_KEYWORDS) {
      if (node[keyword] !== undefined) {
        out.constraints[keyword] = node[keyword];
      }
    }
    // 3.0 boolean exclusive bounds → 3.1 numeric ones
    if (node.exclusiveMinimum === true && node.minimum !== undefined) {
      out.constraints.exclusiveMinimum = node.minimum;
      delete out.constraints.minimum;
    }
    if (node.exclusiveMaximum === true && node.maximum !== undefined) {
      out.constraints.exclusiveMaximum = node.maximum;
      delete out.constraints.maximum;
    }
    if (out.constraints.exclusiveMinimum === false) {
      delete out.constraints.exclusiveMinimum;
    }
    if (out.constraints.exclusiveMaximum === false) {
      delete out.constraints.exclusiveMaximum;
    }

    if (node.properties !== undefined && typeof node.properties === 'object') {
      out.properties = {};
      for (const [name, prop] of Object.entries(node.properties as Json)) {
        out.properties[name] = this.schema(prop, refs);
      }
      out.required = Array.isArray(node.required) ? [...new Set(node.required as string[])].sort() : [];
    }
    if (node.additionalProperties !== undefined && node.additionalProperties !== true) {
      const additional: Schema = this.schema(node.additionalProperties, refs);
      // `{}` is the same as no additionalProperties at all
      if (!isAny(additional) || additional.unresolved !== undefined) {
        out.additionalProperties = additional;
      }
    }
    if (node.items !== undefined && !Array.isArray(node.items)) {
      out.items = this.schema(node.items, refs);
    }

    return out;
  }

  public parameter(input: Json): Parameter[] {
    const { node } = this.resolveRef(input);
    const schema: Schema = this.schema(node.schema ?? (node.type !== undefined ? node : undefined));
    const location: string = node.in;

    // An object query parameter (`style: form, explode: true`) is a set of query parameters
    if (location === 'query' && schema.types.includes('object') && schema.properties !== undefined && node.explode !== false) {
      return Object.entries(schema.properties).map(([name, prop]: [string, Schema]): Parameter => ({
        name,
        in: 'query',
        required: (schema.required ?? []).includes(name),
        description: prop.description,
        schema: prop,
      }));
    }

    return [
      {
        name: location === 'header' ? String(node.name).toLowerCase() : String(node.name),
        in: location,
        required: node.required === true,
        description: typeof node.description === 'string' ? node.description : schema.description,
        schema,
      },
    ];
  }

  private content(content: Json): MediaContent {
    const out: MediaContent = {};
    for (const [mediaType, media] of Object.entries((content ?? {}) as Json)) {
      out[mediaType.split(';')[0].trim()] = this.schema((media as Json)?.schema);
    }

    return out;
  }

  private isSecured(op: Json): boolean {
    const requirements: Json[] | undefined = op.security ?? this.doc.security;
    if (!Array.isArray(requirements) || requirements.length === 0) {
      return false;
    }

    // `[{}]` or `[{}, {bearer: []}]`: credentials are optional
    return requirements.every((r: Json): boolean => r !== null && typeof r === 'object' && Object.keys(r).length > 0);
  }

  public document(): NormalizedDocument {
    const prefix: string = serverPrefix(this.doc);
    const operations: Operation[] = [];

    for (const [rawPath, rawItem] of Object.entries((this.doc.paths ?? {}) as Json)) {
      const item: Json = this.resolveRef(rawItem).node;
      const path: string = normalizePath(prefix + rawPath);
      for (const method of HTTP_METHODS) {
        const op: Json = item[method];
        if (op === undefined) {
          continue;
        }

        const parameters: Map<string, Parameter> = new Map();
        for (const param of [...(item.parameters ?? []), ...(op.parameters ?? [])]) {
          for (const normalized of this.parameter(param)) {
            if (['body', 'formData'].includes(normalized.in)) {
              continue;
            }
            parameters.set(`${normalized.in}:${normalized.name}`, normalized);
          }
        }

        const responses: Operation['responses'] = {};
        for (const [status, response] of Object.entries((op.responses ?? {}) as Json)) {
          if (status === 'default') {
            continue;
          }
          responses[status] = { content: this.content(this.resolveRef(response).node?.content) };
        }

        const body: Json = op.requestBody === undefined ? undefined : this.resolveRef(op.requestBody).node;
        operations.push({
          method,
          path,
          summary: op.summary,
          description: op.description,
          secured: this.isSecured(op),
          parameters: [...parameters.values()],
          requestBody:
            body === undefined ? undefined : { required: body.required === true, content: this.content(body.content) },
          responses,
        });
      }
    }

    return { version: String(this.doc.openapi ?? this.doc.swagger), operations };
  }
}

// ------------------------------------------------------------------ helpers

const serverPrefix = (doc: Json): string => {
  const url: unknown = doc.servers?.[0]?.url;
  if (typeof url !== 'string') {
    return '';
  }
  const path: string = url.replace(/^[a-z]+:\/\/[^/]+/i, '');

  return path === '/' ? '' : path.replace(/\/$/, '');
};

/** `/a//b/` → `/a/b` and `{id}` names kept */
export const normalizePath = (path: string): string => {
  const clean: string = `/${path.split('/').filter((part: string): boolean => part !== '').join('/')}`;

  return clean.replace(/:(\w+)/g, '{$1}');
};

export const isAny = (schema: Schema): boolean =>
  schema.types.length === 0 &&
  schema.enum === undefined &&
  schema.properties === undefined &&
  schema.anyOf === undefined &&
  schema.items === undefined &&
  schema.additionalProperties === undefined;

const isNullOnly = (schema: Schema): boolean =>
  schema.nullable && isAny(schema) && schema.unresolved === undefined;

/** `anyOf: [{const: 'a'}, {const: 'b'}]` → `enum: ['a', 'b']` */
const mergeEnumBranches = (branches: Schema[]): Schema[] => {
  const enumOnly: Schema[] = branches.filter(
    (b: Schema): boolean => b.enum !== undefined && b.properties === undefined && b.anyOf === undefined,
  );
  if (enumOnly.length < 2) {
    return branches;
  }
  const types: string[] = [...new Set(enumOnly.flatMap((b: Schema): string[] => b.types))].sort();
  const merged: Schema = {
    ...anySchema(),
    types,
    enum: [...new Set(enumOnly.flatMap((b: Schema): unknown[] => b.enum ?? []))],
    nullable: enumOnly.some((b: Schema): boolean => b.nullable),
  };

  return [merged, ...branches.filter((b: Schema): boolean => !enumOnly.includes(b))];
};

/** Intersection of two schemas, as produced by `allOf` */
export const mergeSchemas = (a: Schema, b: Schema): Schema => {
  if (isAny(a) && a.unresolved === undefined) {
    return { ...b, description: b.description ?? a.description, constraints: { ...a.constraints, ...b.constraints } };
  }
  if (isAny(b) && b.unresolved === undefined) {
    return { ...a, description: b.description ?? a.description, constraints: { ...a.constraints, ...b.constraints } };
  }
  const out: Schema = {
    types: a.types.length === 0 ? b.types : b.types.length === 0 ? a.types : a.types.filter((t: string) => b.types.includes(t)),
    nullable: a.nullable && b.nullable,
    format: b.format ?? a.format,
    enum: b.enum ?? a.enum,
    constraints: { ...a.constraints, ...b.constraints },
    description: b.description ?? a.description,
    unresolved: a.unresolved ?? b.unresolved,
  };
  if (a.properties !== undefined || b.properties !== undefined) {
    out.properties = { ...(a.properties ?? {}) };
    for (const [name, prop] of Object.entries(b.properties ?? {})) {
      out.properties[name] = out.properties[name] === undefined ? prop : mergeSchemas(out.properties[name], prop);
    }
    out.required = [...new Set([...(a.required ?? []), ...(b.required ?? [])])].sort();
  }
  out.additionalProperties = b.additionalProperties ?? a.additionalProperties;
  out.items = a.items !== undefined && b.items !== undefined ? mergeSchemas(a.items, b.items) : (b.items ?? a.items);
  out.anyOf = b.anyOf ?? a.anyOf;
  for (const key of Object.keys(out) as (keyof Schema)[]) {
    if (out[key] === undefined) {
      delete out[key];
    }
  }

  return out;
};
