/**
 * Contract test: checks that `expected/openapi.yaml` describes the real behaviour of the app.
 *
 * - the documented operations are exactly the routes the app serves,
 * - every response (status, content type, body) matches the document, with no undocumented property,
 * - every request constraint of the document is enforced (one invalid request per constraint → 400),
 * - every documented status code is observed at least once.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { INestApplication, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { ModulesContainer } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import Ajv2020, { ValidateFunction } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request, { Response } from 'supertest';
import { parse } from 'yaml';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const doc: Json = parse(readFileSync(join(__dirname, '../../expected/openapi.yaml'), 'utf8'));
const METHODS: string[] = ['get', 'post', 'put', 'patch', 'delete'];

// ------------------------------------------------------------------ document helpers

const resolve = (node: Json): Json => {
  let current: Json = node;
  while (current?.$ref !== undefined) {
    current = (current.$ref as string)
      .slice(2)
      .split('/')
      .reduce((acc: Json, key: string): Json => acc[key.replace(/~1/g, '/').replace(/~0/g, '~')], doc);
  }

  return current;
};

/** Fully dereference a schema; `strict` forbids undocumented properties */
const deref = (schema: Json, strict: boolean): Json => {
  const node: Json = resolve(schema);
  if (Array.isArray(node)) {
    return node.map((item: Json): Json => deref(item, strict));
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }
  const out: Json = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = key === 'properties'
      ? Object.fromEntries(Object.entries(value as Json).map(([k, v]: [string, Json]) => [k, deref(v, strict)]))
      : deref(value, strict);
  }
  if (strict && out.properties !== undefined && out.additionalProperties === undefined) {
    out.additionalProperties = false;
  }

  return out;
};

interface Operation {
  method: string;
  path: string;
  op: Json;
  parameters: Json[];
}

const operations: Operation[] = Object.entries(doc.paths as Json).flatMap(([path, item]: [string, Json]) =>
  METHODS.filter((method: string): boolean => item[method] !== undefined).map(
    (method: string): Operation => ({
      method,
      path,
      op: item[method],
      parameters: [...(item.parameters ?? []), ...(item[method].parameters ?? [])].map(resolve),
    }),
  ),
);

const findOperation = (method: string, path: string): Operation => {
  const operation: Operation | undefined = operations.find((o: Operation) => o.method === method && o.path === path);
  if (operation === undefined) {
    throw new Error(`${method.toUpperCase()} ${path} is not documented`);
  }

  return operation;
};

const ajv: Ajv2020 = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);
const validators: Map<string, ValidateFunction> = new Map();
const validatorFor = (key: string, schema: Json): ValidateFunction => {
  if (!validators.has(key)) {
    validators.set(key, ajv.compile(deref(schema, true)));
  }

  return validators.get(key) as ValidateFunction;
};

// ------------------------------------------------------------------ calling the app

let app: INestApplication;
let mongo: MongoMemoryServer;
const observed: Set<string> = new Set();

const token = (identifier: Json): string => `Bearer ${Buffer.from(JSON.stringify(identifier)).toString('base64url')}`;
const ALL_ROLES: string[] = [
  'shelter:reader', 'shelter:editor', 'shelter:admin', 'animal:reader', 'animal:editor',
  'adoption:reader', 'adoption:creator', 'adoption:reviewer', 'book:librarian',
];
let shelterIds: string[] = [];
const admin = (): string => token({ sub: 'admin', shelterIds, roles: ALL_ROLES });
const noRole = (): string => token({ sub: 'nobody', shelterIds, roles: [] });

interface CallOptions {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: Json;
  auth?: string | null;
  headers?: Record<string, string>;
}

/** Call a documented operation and check the response against the document */
const call = async (method: string, path: string, options: CallOptions = {}): Promise<Response> => {
  const { op } = findOperation(method, path);
  const url: string = path.replace(/{(\w+)}/g, (_: string, name: string): string => {
    const value: string | undefined = options.params?.[name];
    if (value === undefined) {
      throw new Error(`Missing path parameter ${name} for ${path}`);
    }

    return encodeURIComponent(value);
  });

  let req: request.Test = (request(app.getHttpServer()) as Json)[method](url);
  const auth: string | null = options.auth === undefined ? admin() : options.auth;
  if (auth !== null) {
    req = req.set('Authorization', auth);
  }
  for (const [name, value] of Object.entries(options.headers ?? {})) {
    req = req.set(name, value);
  }
  if (options.query !== undefined) {
    req = req.query(options.query);
  }
  const res: Response = options.body === undefined ? await req : await req.send(options.body);

  const label: string = `${method.toUpperCase()} ${path} → ${res.status}`;
  const response: Json = resolve(op.responses[String(res.status)]);
  if (response === undefined) {
    throw new Error(`${label} is not documented: ${JSON.stringify(res.body)}`);
  }
  observed.add(`${method} ${path} ${res.status}`);

  if (response.content === undefined) {
    expect({ label, body: res.text }).toEqual({ label, body: '' });

    return res;
  }

  const mediaType: string = (res.headers['content-type'] ?? '').split(';')[0];
  expect({ label, mediaType }).toEqual({ label, mediaType: Object.keys(response.content)[0] });
  const body: Json = mediaType === 'application/json' ? res.body : res.text;
  const validate: ValidateFunction = validatorFor(`${method} ${path} ${res.status}`, response.content[mediaType].schema);
  if (!validate(body)) {
    throw new Error(`${label} does not match the document: ${ajv.errorsText(validate.errors)}\n${JSON.stringify(body)}`);
  }

  return res;
};

// ------------------------------------------------------------------ request constraints

interface Mutation {
  description: string;
  apply: (value: Json) => Json;
}

const clone = (value: Json): Json => JSON.parse(JSON.stringify(value));

const setAt = (root: Json, path: (string | number)[], update: (parent: Json, key: string | number) => void): Json => {
  const copy: Json = clone(root);
  const parent: Json = path.slice(0, -1).reduce((acc: Json, key: string | number): Json => acc[key], copy);
  update(parent, path[path.length - 1]);

  return copy;
};

const wrongTypeValue = (schema: Json): Json => {
  if (schema.format === 'date-time') {
    return 'not-a-date';
  }
  switch (schema.type) {
    case 'string':
      return 12345;
    case 'number':
    case 'integer':
      return 'not-a-number';
    case 'boolean':
      return 'not-a-boolean';
    case 'array':
    case 'object':
      return 'not-an-object';
    default:
      return undefined;
  }
};

/** One invalid variant of `value` per constraint documented in `schema` */
const mutationsOf = (schema: Json, value: Json, path: (string | number)[] = []): Mutation[] => {
  const name: string = path.join('.') || '<body>';
  const replace = (description: string, next: Json): Mutation => ({
    description: `${name}: ${description}`,
    apply: (root: Json): Json => (path.length === 0 ? next : setAt(root, path, (p: Json, k: string | number) => (p[k] = next))),
  });
  const mutations: Mutation[] = [];

  // A non-JSON body is parsed as an empty object by Express: only nested values are mutated
  const wrong: Json = path.length === 0 ? undefined : wrongTypeValue(schema);
  if (wrong !== undefined) {
    mutations.push(replace(`not a ${schema.format ?? schema.type}`, wrong));
  }
  if (schema.enum !== undefined) {
    mutations.push(replace('not in enum', 'NOT_IN_ENUM'));
  }
  if (schema.type === 'integer') {
    mutations.push(replace('not an integer', 1.5));
  }
  if (schema.minimum !== undefined) {
    mutations.push(replace(`< ${schema.minimum}`, schema.minimum - 1));
  }
  if (schema.maximum !== undefined) {
    mutations.push(replace(`> ${schema.maximum}`, schema.maximum + 1));
  }
  if (schema.minLength !== undefined) {
    mutations.push(replace(`shorter than ${schema.minLength}`, 'x'.repeat(schema.minLength - 1)));
  }
  if (schema.maxLength !== undefined) {
    mutations.push(replace(`longer than ${schema.maxLength}`, 'x'.repeat(schema.maxLength + 1)));
  }
  if (schema.format === 'email') {
    mutations.push(replace('not an email', 'not-an-email'));
  }
  if (schema.type === 'array') {
    if (schema.minItems !== undefined) {
      mutations.push(replace(`fewer than ${schema.minItems} items`, (value as Json[]).slice(0, schema.minItems - 1)));
    }
    if (schema.maxItems !== undefined) {
      mutations.push(replace(`more than ${schema.maxItems} items`, Array(schema.maxItems + 1).fill(value[0])));
    }
    if ((value as Json[]).length > 0) {
      mutations.push(...mutationsOf(schema.items, value[0], [...path, 0]));
    }
  }
  if (schema.type === 'object' && schema.properties !== undefined) {
    for (const [prop, propSchema] of Object.entries(schema.properties as Json)) {
      if (value[prop] === undefined) {
        throw new Error(`The valid payload must set ${[...path, prop].join('.')} to test its constraints`);
      }
      if ((schema.required ?? []).includes(prop)) {
        mutations.push({
          description: `${[...path, prop].join('.')}: missing`,
          apply: (root: Json): Json => setAt(root, [...path, prop], (p: Json, k: string | number) => delete p[k]),
        });
      }
      mutations.push(...mutationsOf(propSchema, value[prop], [...path, prop]));
    }
  }

  return mutations;
};

/** Check the valid payload is accepted, then that each constraint of the documented body is enforced */
const checkRequestBody = async (
  method: string,
  path: string,
  options: CallOptions & { body: Json },
  expectedStatus: number,
): Promise<Response> => {
  const { op } = findOperation(method, path);
  const schema: Json = deref(resolve(op.requestBody).content['application/json'].schema, false);
  const mutations: Mutation[] = mutationsOf(schema, options.body);
  expect(mutations.length).toBeGreaterThan(0);

  for (const mutation of mutations) {
    const res: Response = await call(method, path, { ...options, body: mutation.apply(options.body) }).catch((err: Error) => {
      throw new Error(`${mutation.description}: ${err.message}`);
    });
    expect({ mutation: mutation.description, status: res.status }).toEqual({ mutation: mutation.description, status: 400 });
  }

  const res: Response = await call(method, path, options);
  expect({ path, status: res.status }).toEqual({ path, status: expectedStatus });

  return res;
};

// ------------------------------------------------------------------ test data

const validShelter: Json = {
  name: 'Happy Paws',
  country: 'FR',
  address: { street: '1 rue des Chats', city: 'Paris', postalCode: '75001', complement: '2nd floor' },
  email: 'contact@happypaws.fr',
  capacity: 10,
  tags: ['cats'],
  metadata: { source: 'e2e' },
};
const validShelterUpdate: Json = {
  name: 'Happier Paws',
  address: { street: '2 rue des Chiens', city: 'Lyon', postalCode: '69001', complement: 'Ground floor' },
  email: 'hello@happypaws.fr',
  capacity: 20,
  tags: ['cats', 'dogs'],
  metadata: { source: 'e2e-update' },
  status: 'FULL',
};
const vaccination: Json = { name: 'Rabies', date: '2024-01-01T00:00:00.000Z', expiresAt: '2025-01-01T00:00:00.000Z' };
const animal: Json = { name: 'Tom', birthDate: '2020-05-01T00:00:00.000Z', sex: 'MALE', vaccinations: [vaccination], weightKg: 4.2 };
const validCat: Json = { ...animal, indoor: true, coatPattern: 'TABBY' };
const validCatUpdate: Json = { ...validCat, name: 'Tommy', status: 'RESERVED' };
const validDog: Json = { ...animal, name: 'Rex', breed: 'Labrador', size: 'LARGE', goodWithKids: true };
const adopter: Json = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '+33612345678' };
const validBook: Json = {
  isbn: '9780306406157',
  title: 'The Cat Care Handbook',
  authors: [{ name: 'Jane Doe', birthYear: 1970 }],
  genre: 'CARE_GUIDE',
  publishedOn: '2010-03-01T00:00:00.000Z',
  pageCount: 240,
  language: 'en',
  topics: ['CAT'],
  rating: 4.5,
  available: true,
};
const { isbn: _isbn, ...validReplaceBook } = validBook;
const UNKNOWN_ID: string = '0123456789abcdef01234567';

// ------------------------------------------------------------------ tests

describe('Contract (expected/openapi.yaml)', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri('petstore');
    // Imported after MONGODB_URI is set: the AppModule reads it at import time
    const { AppModule } = await import('../src/app.module');
    const { setupApp } = await import('../src/setup');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = setupApp(moduleRef.createNestApplication({ logger: false }));
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  it('documents exactly the routes served by the app', () => {
    const served: string[] = [];
    for (const module of app.get(ModulesContainer).values()) {
      for (const controller of module.controllers.values()) {
        const metatype: Json = controller.metatype;
        const base: string = Reflect.getMetadata(PATH_METADATA, metatype);
        for (const key of Object.getOwnPropertyNames(metatype.prototype)) {
          const handler: Json = metatype.prototype[key];
          const requestMethod: RequestMethod | undefined = Reflect.getMetadata(METHOD_METADATA, handler);
          const routePath: string | undefined = Reflect.getMetadata(PATH_METADATA, handler);
          if (typeof handler !== 'function' || requestMethod === undefined || routePath === undefined) {
            continue;
          }
          const path: string = ['/v1', base, routePath]
            .flatMap((part: string): string[] => part.split('/'))
            .filter((part: string): boolean => part !== '')
            .map((part: string): string => part.replace(/^:(\w+)$/, '{$1}'))
            .join('/');
          served.push(`${RequestMethod[requestMethod].toLowerCase()} /${path}`);
        }
      }
    }
    const documented: string[] = operations.map((o: Operation): string => `${o.method} ${o.path}`);
    expect(served.sort()).toEqual(documented.sort());
  });

  it('serves the health check', async () => {
    await call('get', '/v1/health', { auth: null });
  });

  it('serves the shelter routes', async () => {
    const created: Response = await checkRequestBody('post', '/v1/shelters', { body: validShelter }, 201);
    const id: string = created.body._id;
    shelterIds = [id];

    await call('get', '/v1/shelters', { query: { limit: '1', page: '1', sort: '{"name":1}', filter: '{}' } });
    await call('get', '/v1/shelters', { query: { filter: '{not json' } });
    await call('get', '/v1/shelters/{id}', { params: { id } });
    await call('get', '/v1/shelters/{id}', { params: { id: 'not-an-id' } });
    await checkRequestBody('patch', '/v1/shelters/{id}', { params: { id }, body: validShelterUpdate }, 200);
    await call('patch', '/v1/shelters/{id}', { params: { id: 'not-an-id' }, body: validShelterUpdate });
    await call('get', '/v1/shelters/{id}/stats', { params: { id: 'not-an-id' }, query: { year: '2024' } });
    await call('get', '/v1/shelters/{id}/stats', { params: { id }, query: { year: '2024' } });
    await call('get', '/v1/shelters/{id}/stats', { params: { id }, query: { year: 'last-year' } });
    await call('get', '/v1/shelters/{id}/stats', { params: { id } });

    const toDelete: Response = await call('post', '/v1/shelters', { body: validShelter });
    shelterIds = [id, toDelete.body._id];
    await call('delete', '/v1/shelters/{id}', { params: { id: toDelete.body._id } });
    await call('delete', '/v1/shelters/{id}', { params: { id: toDelete.body._id } });
  });

  it('serves the cat and dog routes', async () => {
    const shelterId: string = shelterIds[0];
    const cat: Response = await checkRequestBody('post', '/v1/shelters/{shelterId}/cats', { params: { shelterId }, body: validCat }, 201);
    const catId: string = cat.body._id;
    await call('post', '/v1/shelters/{shelterId}/cats', { params: { shelterId: 'not-an-id' }, body: validCat });
    await call('get', '/v1/shelters/{shelterId}/cats', { params: { shelterId } });
    await call('get', '/v1/shelters/{shelterId}/cats', { params: { shelterId }, query: { sort: '[' } });
    await call('get', '/v1/shelters/{shelterId}/cats', { params: { shelterId: 'not-an-id' } });
    await call('get', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId } });
    await call('get', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId: UNKNOWN_ID } });
    await checkRequestBody('patch', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId }, body: validCatUpdate }, 200);
    await call('patch', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId: UNKNOWN_ID }, body: {} });

    const dog: Response = await checkRequestBody('post', '/v1/shelters/{shelterId}/dogs', { params: { shelterId }, body: validDog }, 201);
    const dogId: string = dog.body._id;
    await call('post', '/v1/shelters/{shelterId}/dogs', { params: { shelterId: 'not-an-id' }, body: validDog });
    await call('get', '/v1/shelters/{shelterId}/dogs', { params: { shelterId } });
    await call('get', '/v1/shelters/{shelterId}/dogs', { params: { shelterId }, query: { filter: '}' } });
    await call('get', '/v1/shelters/{shelterId}/dogs', { params: { shelterId: 'not-an-id' } });
    await call('get', '/v1/shelters/{shelterId}/dogs/{dogId}', { params: { shelterId, dogId } });
    await call('get', '/v1/shelters/{shelterId}/dogs/{dogId}', { params: { shelterId, dogId: 'not-an-id' } });

    const all: Response = await call('get', '/v1/shelters/{shelterId}/animals', { params: { shelterId } });
    expect(all.body).toHaveLength(2);
    const search: Response = await call('get', '/v1/shelters/{shelterId}/animals', {
      params: { shelterId },
      query: { species: 'CAT', status: 'RESERVED', name: 'tom', minAge: '1', includeAdopted: 'true' },
    });
    expect(search.body).toHaveLength(1);
    const invalidQueries: Record<string, string>[] = [{ species: 'BIRD' }, { status: 'LOST' }, { name: 'x'.repeat(51) }, { minAge: '-1' }, { minAge: '1.5' }, { includeAdopted: 'maybe' }];
    for (const query of invalidQueries) {
      const res: Response = await call('get', '/v1/shelters/{shelterId}/animals', { params: { shelterId }, query });
      expect({ query, status: res.status }).toEqual({ query, status: 400 });
    }
    await call('get', '/v1/shelters/{shelterId}/animals', { params: { shelterId: 'not-an-id' } });
    await call('get', '/v1/shelters/{shelterId}/animals/{animalId}', { params: { shelterId, animalId: catId } });
    await call('get', '/v1/shelters/{shelterId}/animals/{animalId}', { params: { shelterId, animalId: dogId } });
    await call('get', '/v1/shelters/{shelterId}/animals/{animalId}', { params: { shelterId, animalId: UNKNOWN_ID } });

    await call('delete', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId } });
    await call('delete', '/v1/shelters/{shelterId}/cats/{catId}', { params: { shelterId, catId } });
  });

  it('serves the adoption routes', async () => {
    const shelterId: string = shelterIds[0];
    const cat: Response = await call('post', '/v1/shelters/{shelterId}/cats', { params: { shelterId }, body: validCat });
    const body: Json = { animalId: cat.body._id, species: 'CAT', adopter, fee: 120, notes: 'Has a garden' };

    const receipt: Response = await checkRequestBody(
      'post',
      '/v1/shelters/{shelterId}/adoptions',
      { params: { shelterId }, body, headers: { 'x-request-id': 'e2e' } },
      201,
    );
    const adoptionId: string = receipt.body.adoptionId;
    await call('post', '/v1/shelters/{shelterId}/adoptions', { params: { shelterId: 'not-an-id' }, body });

    await call('get', '/v1/shelters/{shelterId}/adoptions', { params: { shelterId }, query: { status: 'PENDING' } });
    await call('get', '/v1/shelters/{shelterId}/adoptions', { params: { shelterId }, query: { status: 'LOST' } });
    await call('get', '/v1/shelters/{shelterId}/adoptions', { params: { shelterId: 'not-an-id' } });
    await call('get', '/v1/shelters/{shelterId}/adoptions/{adoptionId}', { params: { shelterId, adoptionId } });
    await call('get', '/v1/shelters/{shelterId}/adoptions/{adoptionId}', { params: { shelterId, adoptionId: UNKNOWN_ID } });

    await call('post', '/v1/shelters/{shelterId}/adoptions/{adoptionId}/approve', { params: { shelterId, adoptionId } });
    await call('post', '/v1/shelters/{shelterId}/adoptions/{adoptionId}/approve', { params: { shelterId, adoptionId } });
    await call('post', '/v1/shelters/{shelterId}/adoptions/{adoptionId}/approve', { params: { shelterId, adoptionId: UNKNOWN_ID } });

    const toReject: Response = await call('post', '/v1/shelters/{shelterId}/adoptions', { params: { shelterId }, body });
    const rejectPath: string = '/v1/shelters/{shelterId}/adoptions/{adoptionId}/reject';
    const reason: Json = { reason: 'The garden has no fence' };
    await checkRequestBody('post', rejectPath, { params: { shelterId, adoptionId: toReject.body.adoptionId }, body: reason }, 200);
    await call('post', rejectPath, { params: { shelterId, adoptionId }, body: reason });
    await call('post', rejectPath, { params: { shelterId, adoptionId: 'not-an-id' }, body: reason });

    await call('delete', '/v1/shelters/{shelterId}/adoptions/{adoptionId}', { params: { shelterId, adoptionId } });
    await call('delete', '/v1/shelters/{shelterId}/adoptions/{adoptionId}', { params: { shelterId, adoptionId } });
  });

  it('serves the book routes', async () => {
    await checkRequestBody('post', '/v1/books', { body: validBook }, 201);
    await call('post', '/v1/books', { body: validBook });

    await call('get', '/v1/books', { auth: null });
    await call('get', '/v1/books', { auth: null, query: { search: 'cat', genre: 'CARE_GUIDE', limit: '5', page: '1' } });
    await call('get', '/v1/books', { auth: null, query: { genre: 'COOKING' } });
    const csv: Response = await call('get', '/v1/books/export', { auth: null });
    expect(csv.text).toContain(validBook.isbn);
    await call('get', '/v1/books/{isbn}', { auth: null, params: { isbn: validBook.isbn } });
    await call('get', '/v1/books/{isbn}', { auth: null, params: { isbn: '0000000000000' } });
    await checkRequestBody('put', '/v1/books/{isbn}', { params: { isbn: validBook.isbn }, body: validReplaceBook }, 200);
    await call('put', '/v1/books/{isbn}', { params: { isbn: '0000000000000' }, body: validReplaceBook });
    await call('delete', '/v1/books/{isbn}', { params: { isbn: validBook.isbn } });
    await call('delete', '/v1/books/{isbn}', { params: { isbn: validBook.isbn } });
  });

  it('enforces the documented security', async () => {
    const params: Record<string, string> = {
      id: shelterIds[0], shelterId: shelterIds[0], catId: UNKNOWN_ID, dogId: UNKNOWN_ID,
      animalId: UNKNOWN_ID, adoptionId: UNKNOWN_ID, isbn: '0000000000000',
    };
    for (const { method, path, op } of operations) {
      const secured: boolean = (op.security ?? []).length > 0;
      const anonymous: Response = await call(method, path, { params, auth: null, query: { year: '2024' } });
      expect({ method, path, status: anonymous.status === 401 }).toEqual({ method, path, status: secured });
      if (op.responses['403'] !== undefined) {
        const forbidden: Response = await call(method, path, { params, auth: noRole(), query: { year: '2024' } });
        expect({ method, path, status: forbidden.status }).toEqual({ method, path, status: 403 });
      }
    }
  });

  it('observed every documented status code', () => {
    const documented: string[] = operations.flatMap((o: Operation) =>
      Object.keys(o.op.responses).map((status: string): string => `${o.method} ${o.path} ${status}`),
    );
    expect(documented.filter((key: string): boolean => !observed.has(key))).toEqual([]);
  });
});
