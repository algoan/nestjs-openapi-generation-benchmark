/**
 * The specifications benchmarked: each has its own expected document, fact categories and ranking.
 */
import { ASYNCAPI_CATEGORIES, ASYNCAPI_CORE_CATEGORIES, compareAsyncApiDocuments } from './correctness/asyncapi.ts';
import { CATEGORIES, compareDocuments, CORE_CATEGORIES } from './correctness/compare.ts';
import type { Category, Comparison } from './correctness/compare.ts';
import type { Json } from './correctness/normalize.ts';
import { EXPECTED_ASYNCAPI_FILE, EXPECTED_FILE } from './variants.ts';
import type { Spec } from './variants.ts';

export interface SpecDefinition {
  title: string;
  expectedFile: string;
  categories: Category[];
  coreCategories: Category[];
  compare: (expected: Json, actual: Json) => Comparison;
  /** What the core and all differences count, for the report */
  coreHelp: string;
  allHelp: string;
}

export const SPECS: Record<Spec, SpecDefinition> = {
  openapi: {
    title: 'OpenAPI',
    expectedFile: EXPECTED_FILE,
    categories: CATEGORIES,
    coreCategories: CORE_CATEGORIES,
    compare: compareDocuments,
    coreHelp: 'operations, parameters, request bodies and success responses (what a generated client relies on)',
    allHelp: 'core + error responses, validation constraints, security and documentation',
  },
  asyncapi: {
    title: 'AsyncAPI',
    expectedFile: EXPECTED_ASYNCAPI_FILE,
    categories: ASYNCAPI_CATEGORIES,
    coreCategories: ASYNCAPI_CORE_CATEGORIES,
    compare: compareAsyncApiDocuments,
    coreHelp: 'operations (action and channel) and message payloads (what a generated consumer or producer relies on)',
    allHelp: 'core + validation constraints and documentation',
  },
};

export const specOf = (value: { spec?: Spec }): Spec => value.spec ?? 'openapi';
