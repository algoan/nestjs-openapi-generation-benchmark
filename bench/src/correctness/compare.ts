/**
 * Fact-based comparison of two normalized OpenAPI documents.
 *
 * Both documents are flattened into atomic facts ("GET /v1/books/{isbn} → 200 → application/json →
 * $.title has type string", "… title is required", "… title has maxLength 100" …). A difference is a fact
 * of the expected document that is missing or has another value in the generated one, or a fact of the
 * generated document that the expected one does not have.
 */
import { Normalizer } from './normalize.ts';
import type { Json, NormalizedDocument, Operation, Parameter, Schema } from './normalize.ts';

export const CATEGORIES = [
  'operations',
  'parameters',
  'requestBody',
  'responses',
  'errors',
  'constraints',
  'security',
  'docs',
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Categories describing the structure of the API (what a generated client relies on) */
export const CORE_CATEGORIES: Category[] = ['operations', 'parameters', 'requestBody', 'responses'];

export interface Fact {
  key: string;
  value: string;
  category: Category;
}

export interface Difference {
  category: Category;
  kind: 'missing' | 'mismatch' | 'extra';
  key: string;
  expected?: string;
  actual?: string;
}

export interface CategoryScore {
  expected: number;
  matched: number;
  missing: number;
  mismatch: number;
  extra: number;
  differences: number;
}

export interface Comparison {
  categories: Record<Category, CategoryScore>;
  core: CategoryScore;
  total: CategoryScore;
  differences: Difference[];
  addedPrefix?: string;
}

const DATA_FORMATS: string[] = ['date-time', 'date', 'time', 'binary', 'byte'];

// ------------------------------------------------------------------ schema facts

const typeOf = (schema: Schema): string =>
  [...new Set(schema.types.map((t: string): string => (t === 'integer' ? 'number' : t)))].sort().join('|');

const schemaFacts = (schema: Schema, path: string, base: Category, out: Fact[], guide?: Schema): void => {
  const push = (suffix: string, value: unknown, category: Category = base): void => {
    out.push({ key: `${path}${suffix}`, value: String(value), category });
  };

  if (schema.unresolved !== undefined) {
    push('#unresolved', schema.unresolved);
  }
  if (schema.types.length > 0) {
    push('#type', typeOf(schema));
  }
  if (schema.types.includes('integer')) {
    push('#integer', true, 'constraints');
  }
  if (schema.nullable) {
    push('#nullable', true);
  }
  if (schema.format !== undefined) {
    push('#format', schema.format, DATA_FORMATS.includes(schema.format) ? base : 'constraints');
  }
  for (const value of schema.enum ?? []) {
    push(`#enum=${JSON.stringify(value)}`, true);
  }
  for (const [keyword, value] of Object.entries(schema.constraints)) {
    push(`#${keyword}`, JSON.stringify(value), 'constraints');
  }
  if (schema.description !== undefined) {
    push('#description', schema.description, 'docs');
  }
  for (const [name, prop] of Object.entries(schema.properties ?? {})) {
    out.push({ key: `${path}.${name}#required`, value: String((schema.required ?? []).includes(name)), category: base });
    schemaFacts(prop, `${path}.${name}`, base, out, guide?.properties?.[name]);
  }
  if (schema.additionalProperties !== undefined) {
    schemaFacts(schema.additionalProperties, `${path}{*}`, base, out, guide?.additionalProperties);
  }
  if (schema.items !== undefined) {
    schemaFacts(schema.items, `${path}[]`, base, out, guide?.items);
  }
  if (schema.anyOf !== undefined) {
    const indexes: string[] = matchBranches(schema.anyOf, guide?.anyOf, base);
    schema.anyOf.forEach((branch: Schema, i: number): void => {
      schemaFacts(branch, `${path}|${indexes[i]}`, base, out, guide?.anyOf?.[Number(indexes[i])]);
    });
  }
};

/** Pair each union branch with the most similar branch of the expected union */
const matchBranches = (branches: Schema[], guide: Schema[] | undefined, base: Category): string[] => {
  if (guide === undefined) {
    return branches.map((_: Schema, i: number): string => String(i));
  }
  const factSet = (schema: Schema, guideSchema?: Schema): Set<string> => {
    const facts: Fact[] = [];
    schemaFacts(schema, '', base, facts, guideSchema);

    return new Set(facts.map((f: Fact): string => `${f.key}=${f.value}`));
  };
  const expectedSets: Set<string>[] = guide.map((g: Schema): Set<string> => factSet(g));
  const pairs: { i: number; j: number; score: number }[] = [];
  branches.forEach((branch: Schema, i: number): void => {
    guide.forEach((g: Schema, j: number): void => {
      const actual: Set<string> = factSet(branch, g);
      const score: number = [...actual].filter((f: string): boolean => expectedSets[j].has(f)).length;
      pairs.push({ i, j, score });
    });
  });
  pairs.sort((a, b) => b.score - a.score);

  const result: string[] = branches.map((_: Schema, i: number): string => `x${i}`);
  const usedBranches: Set<number> = new Set();
  const usedGuides: Set<number> = new Set();
  for (const { i, j, score } of pairs) {
    if (score > 0 && !usedBranches.has(i) && !usedGuides.has(j)) {
      result[i] = String(j);
      usedBranches.add(i);
      usedGuides.add(j);
    }
  }

  return result;
};

// ------------------------------------------------------------------ operation facts

const docText = (...parts: (string | undefined)[]): string | undefined => {
  const text: string = parts.filter((p?: string): boolean => p !== undefined && p.trim() !== '').join(' ');

  return text === '' ? undefined : text;
};

const operationFacts = (op: Operation, out: Fact[], guide?: Operation): void => {
  const opKey: string = `${op.method.toUpperCase()} ${op.path}`;
  out.push({ key: opKey, value: 'true', category: 'operations' });
  out.push({ key: `${opKey}#secured`, value: String(op.secured), category: 'security' });
  const summary: string | undefined = docText(op.summary, op.description);
  if (summary !== undefined) {
    out.push({ key: `${opKey}#summary`, value: summary, category: 'docs' });
  }

  for (const param of op.parameters) {
    const key: string = `${opKey} param ${param.in}:${param.name}`;
    const guideParam: Parameter | undefined = guide?.parameters.find(
      (p: Parameter): boolean => p.in === param.in && p.name === param.name,
    );
    out.push({ key, value: 'true', category: 'parameters' });
    out.push({ key: `${key}#required`, value: String(param.required), category: 'parameters' });
    if (param.description !== undefined) {
      out.push({ key: `${key}#description`, value: param.description, category: 'docs' });
    }
    // the parameter description is already taken from the schema when there is none on the parameter
    schemaFacts({ ...param.schema, description: undefined }, `${key} $`, 'parameters', out, guideParam?.schema);
  }

  if (op.requestBody !== undefined) {
    const key: string = `${opKey} body`;
    out.push({ key, value: 'true', category: 'requestBody' });
    out.push({ key: `${key}#required`, value: String(op.requestBody.required), category: 'requestBody' });
    for (const [mediaType, schema] of Object.entries(op.requestBody.content)) {
      out.push({ key: `${key} ${mediaType}`, value: 'true', category: 'requestBody' });
      schemaFacts(schema, `${key} ${mediaType} $`, 'requestBody', out, guide?.requestBody?.content[mediaType]);
    }
  }

  // A single success response is keyed `success`, so that a wrong status code counts as one difference
  const successCodes: string[] = Object.keys(op.responses).filter((s: string): boolean => /^[23]/.test(s));
  const guideSuccess: string[] = Object.keys(guide?.responses ?? {}).filter((s: string): boolean => /^[23]/.test(s));
  for (const [status, response] of Object.entries(op.responses)) {
    const isSuccess: boolean = /^[23]/.test(status);
    const category: Category = isSuccess ? 'responses' : 'errors';
    let label: string = status;
    let guideResponse = guide?.responses[status];
    if (isSuccess && successCodes.length === 1) {
      label = 'success';
      out.push({ key: `${opKey} success#status`, value: status, category: 'responses' });
      guideResponse = guideSuccess.length === 1 ? guide?.responses[guideSuccess[0]] : guideResponse;
    }
    const key: string = `${opKey} ${label}`;
    out.push({ key, value: 'true', category });
    for (const [mediaType, schema] of Object.entries(response.content)) {
      out.push({ key: `${key} ${mediaType}`, value: 'true', category });
      schemaFacts(schema, `${key} ${mediaType} $`, category, out, guideResponse?.content[mediaType]);
    }
  }
};

// ------------------------------------------------------------------ comparison

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.\s]+$/, '')
    .trim();

const emptyScore = (): CategoryScore => ({ expected: 0, matched: 0, missing: 0, mismatch: 0, extra: 0, differences: 0 });

/** Common first path segment of every expected operation (the global prefix, e.g. `/v1`) */
const commonPrefix = (doc: NormalizedDocument): string | undefined => {
  const firsts: Set<string> = new Set(doc.operations.map((op: Operation): string => op.path.split('/')[1]));

  return firsts.size === 1 ? `/${[...firsts][0]}` : undefined;
};

export const compareDocuments = (expectedDoc: Json, actualDoc: Json): Comparison => {
  const expected: NormalizedDocument = new Normalizer(expectedDoc).document();
  const actual: NormalizedDocument = new Normalizer(actualDoc).document();
  const differences: Difference[] = [];

  // A missing global prefix is one difference, not one per operation
  const prefix: string | undefined = commonPrefix(expected);
  let addedPrefix: string | undefined;
  if (
    prefix !== undefined &&
    actual.operations.length > 0 &&
    actual.operations.every((op: Operation): boolean => !op.path.startsWith(`${prefix}/`) && op.path !== prefix)
  ) {
    addedPrefix = prefix;
    for (const op of actual.operations) {
      op.path = `${prefix}${op.path === '/' ? '' : op.path}`;
    }
    differences.push({ category: 'operations', kind: 'mismatch', key: 'global prefix', expected: prefix, actual: '' });
  }

  const expectedFacts: Fact[] = [];
  for (const op of expected.operations) {
    operationFacts(op, expectedFacts);
  }
  const actualFacts: Fact[] = [];
  for (const op of actual.operations) {
    const guide: Operation | undefined = expected.operations.find(
      (o: Operation): boolean => o.method === op.method && o.path === op.path,
    );
    operationFacts(op, actualFacts, guide);
  }

  const actualByKey: Map<string, Fact> = new Map(actualFacts.map((f: Fact): [string, Fact] => [f.key, f]));
  const expectedKeys: Set<string> = new Set(expectedFacts.map((f: Fact): string => f.key));
  const categories = Object.fromEntries(CATEGORIES.map((c: Category) => [c, emptyScore()])) as Record<Category, CategoryScore>;
  if (addedPrefix !== undefined) {
    categories.operations.mismatch += 1;
  }

  for (const fact of expectedFacts) {
    const score: CategoryScore = categories[fact.category];
    score.expected += 1;
    const other: Fact | undefined = actualByKey.get(fact.key);
    if (fact.category === 'docs') {
      // documentation is only checked for recall: the expected text must appear in the generated one
      if (other !== undefined && normalizeText(other.value).includes(normalizeText(fact.value))) {
        score.matched += 1;
      } else {
        score.missing += 1;
        differences.push({ category: 'docs', kind: 'missing', key: fact.key, expected: fact.value, actual: other?.value });
      }
      continue;
    }
    if (other === undefined) {
      score.missing += 1;
      differences.push({ category: fact.category, kind: 'missing', key: fact.key, expected: fact.value });
    } else if (other.value !== fact.value) {
      score.mismatch += 1;
      differences.push({ category: fact.category, kind: 'mismatch', key: fact.key, expected: fact.value, actual: other.value });
    } else {
      score.matched += 1;
    }
  }
  for (const fact of actualFacts) {
    if (!expectedKeys.has(fact.key) && fact.category !== 'docs') {
      categories[fact.category].extra += 1;
      differences.push({ category: fact.category, kind: 'extra', key: fact.key, actual: fact.value });
    }
  }

  const sum = (cats: readonly Category[]): CategoryScore => {
    const out: CategoryScore = emptyScore();
    for (const c of cats) {
      for (const k of Object.keys(out) as (keyof CategoryScore)[]) {
        out[k] += categories[c][k];
      }
    }

    return out;
  };
  for (const score of Object.values(categories)) {
    score.differences = score.missing + score.mismatch + score.extra;
  }

  return { categories, core: sum(CORE_CATEGORIES), total: sum(CATEGORIES), differences, addedPrefix };
};
