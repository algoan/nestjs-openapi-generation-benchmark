/**
 * Fact-based comparison of two AsyncAPI documents (2.x or 3.x).
 *
 * Both documents are read as the operations of the application: an action (`send` or `receive`) on a channel
 * address, with the payload of its messages. AsyncAPI 2.x `publish` (others publish, the application receives)
 * is read as `receive`, and `subscribe` as `send`. Channel, operation and message ids are ignored.
 */
import { docText, scoreFacts, schemaFacts } from './compare.ts';
import type { Category, Comparison, Fact } from './compare.ts';
import { Normalizer } from './normalize.ts';
import type { Json, Schema } from './normalize.ts';

export const ASYNCAPI_CATEGORIES: Category[] = ['operations', 'payloads', 'constraints', 'docs'];

/** What a generated consumer or producer relies on */
export const ASYNCAPI_CORE_CATEGORIES: Category[] = ['operations', 'payloads'];

export interface AsyncOperation {
  action: string;
  address: string;
  docs?: string;
  /** Union of the payloads of its messages, undefined when no message has one */
  payload?: Schema;
}

const OPENAPI_30_FORMAT: RegExp = /^application\/vnd\.oai\.openapi(\+json|\+yaml)?(;version=3\.0(\.\d+)?)?$/;

export class AsyncApiNormalizer {
  private readonly doc: Json;
  private readonly normalizer: Normalizer;

  constructor(doc: Json) {
    this.doc = doc;
    this.normalizer = new Normalizer(doc, false);
  }

  private resolve(node: Json): Json {
    return this.normalizer.resolveRef(node).node;
  }

  private payloadOf(messages: Json[]): Schema | undefined {
    const schemas: Json[] = [];
    let oas30: boolean = false;
    for (const message of messages.map((m: Json): Json => this.resolve(m))) {
      if (message?.payload === undefined) {
        continue;
      }
      const payload: Json = this.resolve(message.payload);
      // AsyncAPI 3 Multi Format Schema Object: `{ schemaFormat, schema }`
      const format: unknown = payload?.schemaFormat ?? message.schemaFormat;
      oas30 = oas30 || (typeof format === 'string' && OPENAPI_30_FORMAT.test(format));
      schemas.push(payload?.schemaFormat !== undefined && payload.schema !== undefined ? payload.schema : message.payload);
    }
    if (schemas.length === 0) {
      return undefined;
    }

    return new Normalizer(this.doc, oas30).schema(schemas.length === 1 ? schemas[0] : { anyOf: schemas });
  }

  private messageDocs(messages: Json[]): (string | undefined)[] {
    return messages.map((m: Json): Json => this.resolve(m)).flatMap((m: Json): (string | undefined)[] => [m?.title, m?.summary, m?.description]);
  }

  public operations(): AsyncOperation[] {
    const version: string = String(this.doc.asyncapi ?? '');

    return version.startsWith('2.') || version.startsWith('1.') ? this.operationsV2() : this.operationsV3();
  }

  private operationsV3(): AsyncOperation[] {
    return Object.values((this.doc.operations ?? {}) as Json).map((raw: Json): AsyncOperation => {
      const op: Json = this.resolve(raw);
      const ref: unknown = op.channel?.$ref;
      const channel: Json = this.resolve(op.channel) ?? {};
      const key: string = typeof ref === 'string' ? decodeURIComponent(ref.split('/').pop() ?? '') : '';
      const messages: Json[] = Array.isArray(op.messages) ? op.messages : Object.values((channel.messages ?? {}) as Json);

      return {
        action: String(op.action),
        address: String(channel.address ?? key).trim(),
        docs: docText(op.title, op.summary, op.description, ...this.messageDocs(messages)),
        payload: this.payloadOf(messages),
      };
    });
  }

  private operationsV2(): AsyncOperation[] {
    const out: AsyncOperation[] = [];
    for (const [address, rawItem] of Object.entries((this.doc.channels ?? {}) as Json)) {
      const item: Json = this.resolve(rawItem);
      for (const [keyword, action] of [['publish', 'receive'], ['subscribe', 'send']]) {
        const op: Json = item[keyword] === undefined ? undefined : this.resolve(item[keyword]);
        if (op === undefined) {
          continue;
        }
        const message: Json = op.message === undefined ? undefined : this.resolve(op.message);
        const messages: Json[] = message === undefined ? [] : Array.isArray(message.oneOf) ? message.oneOf : [message];
        out.push({
          action,
          address: address.trim(),
          docs: docText(op.summary, op.description, ...this.messageDocs(messages)),
          payload: this.payloadOf(messages),
        });
      }
    }

    return out;
  }
}

const operationFacts = (op: AsyncOperation, out: Fact[], guide?: AsyncOperation): void => {
  const key: string = `${op.action} ${op.address}`;
  out.push({ key, value: 'true', category: 'operations' });
  if (op.docs !== undefined) {
    out.push({ key: `${key}#summary`, value: op.docs, category: 'docs' });
  }
  if (op.payload !== undefined) {
    schemaFacts(op.payload, `${key} $`, 'payloads', out, guide?.payload);
  }
};

const facts = (operations: AsyncOperation[], guides?: AsyncOperation[]): Fact[] => {
  const out: Fact[] = [];
  for (const op of operations) {
    operationFacts(op, out, guides?.find((g: AsyncOperation): boolean => g.action === op.action && g.address === op.address));
  }

  return out;
};

export const isAsyncApi = (doc: Json): boolean => doc !== null && typeof doc === 'object' && doc.asyncapi !== undefined;

export const compareAsyncApiDocuments = (expectedDoc: Json, actualDoc: Json): Comparison => {
  const expected: AsyncOperation[] = new AsyncApiNormalizer(expectedDoc).operations();
  const actual: AsyncOperation[] = new AsyncApiNormalizer(actualDoc).operations();

  return scoreFacts(facts(expected), facts(actual, expected), ASYNCAPI_CATEGORIES, ASYNCAPI_CORE_CATEGORIES);
};
