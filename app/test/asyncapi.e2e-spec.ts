/**
 * Contract test: checks that `expected/asyncapi.yaml` describes the real Pub/Sub events of the app.
 *
 * - the documented `receive` channels are exactly the topics the app subscribes to,
 * - every event the app publishes is documented as `send` on its channel, and its JSON payload matches the
 *   document, with no undocumented property,
 * - every documented `send` channel is observed at least once.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { ReadPacket } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request, { Response } from 'supertest';
import { parse } from 'yaml';
import { PubSubClient } from '../src/core/pubsub/pubsub.client';
import { PubSubServer } from '../src/core/pubsub/pubsub.server';

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/** `expected/asyncapi.yaml` at the root of the repository, also found when the test runs from `variants/<tool>/test` */
const findExpected = (dir: string): string => {
  const candidate: string = join(dir, 'expected/asyncapi.yaml');
  if (existsSync(candidate)) {
    return candidate;
  }
  if (dirname(dir) === dir) {
    throw new Error('expected/asyncapi.yaml not found');
  }

  return findExpected(dirname(dir));
};

const doc: Json = parse(readFileSync(findExpected(__dirname), 'utf8'));

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

/** Fully dereference a schema, forbidding undocumented properties */
const deref = (schema: Json): Json => {
  const node: Json = resolve(schema);
  if (Array.isArray(node)) {
    return node.map(deref);
  }
  if (node === null || typeof node !== 'object') {
    return node;
  }
  const out: Json = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = key === 'properties'
      ? Object.fromEntries(Object.entries(value as Json).map(([k, v]: [string, Json]) => [k, deref(v)]))
      : deref(value);
  }
  if (out.properties !== undefined && out.additionalProperties === undefined) {
    out.additionalProperties = false;
  }

  return out;
};

/** Documented addresses of an action, with the payload schemas of their messages */
const channelsOf = (action: 'send' | 'receive'): Map<string, Json[]> => {
  const channels: Map<string, Json[]> = new Map();
  for (const op of Object.values(doc.operations as Json)) {
    if ((op as Json).action !== action) {
      continue;
    }
    const address: string = resolve((op as Json).channel).address;
    const payloads: Json[] = ((op as Json).messages as Json[]).map((m: Json): Json => resolve(m).payload);
    channels.set(address, [...(channels.get(address) ?? []), ...payloads]);
  }

  return channels;
};

const ajv: Ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);

// ------------------------------------------------------------------ calling the app

let app: INestApplication;
let mongo: MongoMemoryServer;
const server: PubSubServer = new PubSubServer();
const published: ReadPacket[] = [];

const token = (identifier: Json): string => `Bearer ${Buffer.from(JSON.stringify(identifier)).toString('base64url')}`;
const ROLES: string[] = ['shelter:admin', 'animal:editor', 'adoption:creator', 'adoption:reviewer', 'book:librarian'];
let shelterIds: string[] = [];

const post = async (url: string, body: Json, status: number): Promise<Response> => {
  const res: Response = await request(app.getHttpServer())
    .post(url)
    .set('Authorization', token({ sub: 'admin', shelterIds, roles: ROLES }))
    .send(body);
  expect({ url, status: res.status }).toEqual({ url, status });

  return res;
};

const animal: Json = {
  name: 'Tom',
  birthDate: '2020-05-01T00:00:00.000Z',
  sex: 'MALE',
  vaccinations: [{ name: 'Rabies', date: '2024-01-01T00:00:00.000Z' }],
  indoor: true,
};
const adopter: Json = { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', phone: '+33612345678' };
const book: Json = {
  isbn: '9780306406157',
  title: 'The Cat Care Handbook',
  authors: [{ name: 'Jane Doe', birthYear: 1970 }],
  genre: 'CARE_GUIDE',
  publishedOn: '2010-03-01T00:00:00.000Z',
  pageCount: 240,
  topics: ['CAT'],
  rating: 4.5,
};

// ------------------------------------------------------------------ tests

describe('Contract (expected/asyncapi.yaml)', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongo.getUri('petstore');
    // Imported after MONGODB_URI is set: the AppModule reads it at import time
    const { AppModule } = await import('../src/app.module');
    const { setupApp } = await import('../src/setup');
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = setupApp(moduleRef.createNestApplication({ logger: false }));
    app.connectMicroservice({ strategy: server });
    await app.startAllMicroservices();
    await app.init();

    jest.spyOn(PubSubClient.prototype as Json, 'dispatchEvent').mockImplementation(async (packet: unknown) => {
      // Pub/Sub carries the JSON serialization of the data
      published.push({ ...(packet as ReadPacket), data: JSON.parse(JSON.stringify((packet as ReadPacket).data)) });
    });
  });

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  it('documents exactly the topics the app subscribes to', () => {
    const subscribed: string[] = [...server.getHandlers().entries()]
      .filter(([, handler]) => handler.isEventHandler === true)
      .map(([pattern]) => pattern);
    expect(subscribed.sort()).toEqual([...channelsOf('receive').keys()].sort());
  });

  it('documents the events the app publishes', async () => {
    const shelter: Response = await post('/v1/shelters', { name: 'Happy Paws', country: 'FR', capacity: 10 }, 201);
    shelterIds = [shelter.body._id];
    const shelterUrl: string = `/v1/shelters/${shelter.body._id}`;
    const cat: Response = await post(`${shelterUrl}/cats`, animal, 201);
    const adoption: Json = { animalId: cat.body._id, species: 'CAT', adopter, fee: 120 };

    const approved: Response = await post(`${shelterUrl}/adoptions`, adoption, 201);
    await post(`${shelterUrl}/adoptions/${approved.body.adoptionId}/approve`, {}, 200);
    const rejected: Response = await post(`${shelterUrl}/adoptions`, { ...adoption, adopter: { ...adopter, phone: undefined } }, 201);
    await post(`${shelterUrl}/adoptions/${rejected.body.adoptionId}/reject`, { reason: 'The garden has no fence' }, 200);
    await post('/v1/books', book, 201);
    await post('/v1/books', { ...book, isbn: '9781861972712', authors: [{ name: 'John Doe' }], publishedOn: undefined }, 201);

    const documented: Map<string, Json[]> = channelsOf('send');
    for (const { pattern, data } of published) {
      const payloads: Json[] | undefined = documented.get(String(pattern));
      if (payloads === undefined) {
        throw new Error(`${String(pattern)} is published but not documented`);
      }
      const validators: ValidateFunction[] = payloads.map((payload: Json): ValidateFunction => ajv.compile(deref(payload)));
      if (!validators.some((validate: ValidateFunction): boolean => validate(data))) {
        const errors: string = validators.map((validate: ValidateFunction): string => ajv.errorsText(validate.errors)).join('; ');
        throw new Error(`${String(pattern)} does not match the document: ${errors}\n${JSON.stringify(data)}`);
      }
    }
    const observed: Set<string> = new Set(published.map((packet: ReadPacket): string => String(packet.pattern)));
    expect([...documented.keys()].filter((address: string): boolean => !observed.has(address))).toEqual([]);
  });
});
