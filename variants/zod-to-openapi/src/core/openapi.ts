import { extendZodWithOpenApi, OpenAPIRegistry, ResponseConfig } from '@asteasolutions/zod-to-openapi';
import { z, ZodType } from 'zod';

extendZodWithOpenApi(z);

/**
 * Collects the schemas and routes declared in the `*.openapi.ts` files
 */
export const registry: OpenAPIRegistry = new OpenAPIRegistry();
registry.registerComponent('securitySchemes', 'bearer', { type: 'http', scheme: 'bearer' });

export const objectId = z.string();
export const dateTime = z.iso.datetime();
export const shelterParams = z.object({ shelterId: objectId });

export const jsonBody = (schema: ZodType) => ({ required: true, content: { 'application/json': { schema } } });
export const json = (schema: ZodType, description: string = 'Success'): ResponseConfig => ({
  description,
  content: { 'application/json': { schema } },
});
export const noContent: ResponseConfig = { description: 'No content' };

const HttpError = z.object({ code: z.string(), message: z.string(), status: z.number() }).openapi('HttpError');

export const badRequest = { 400: json(HttpError, 'Invalid request') };
export const authErrors = {
  401: json(HttpError, 'Missing or invalid bearer token'),
  403: json(HttpError, 'Missing role or shelter access'),
};
export const notFound = { 404: json(HttpError, 'Unknown entity') };
export const conflict = { 409: json(HttpError, 'Conflict with the current state of the resource') };

/** Public route: no bearer token needed */
export const unprotected: [] = [];

/** Query parameters read by `@PaginationParams({ perPageName: 'limit' })` */
export const paginationQuery = z.object({
  page: z.number().int().default(1).describe('Page number, starting at 1'),
  limit: z.number().int().default(10).describe('Number of resources per page'),
  filter: z.string().optional().describe('JSON-encoded Mongo filter'),
  sort: z.string().optional().describe('JSON-encoded Mongo sort, e.g. `{"name":1}`'),
});

const PaginationLinks = z
  .object({
    next: z.string().nullable(),
    previous: z.string().nullable(),
    first: z.string().nullable(),
    last: z.string().nullable(),
    totalPages: z.number().nullable(),
    totalResources: z.number().nullable(),
  })
  .openapi('PaginationLinks');

/** Body built by the PaginationBodyInterceptor */
export const paginated = (resource: ZodType) => z.object({ resources: z.array(resource), pagination: PaginationLinks });
