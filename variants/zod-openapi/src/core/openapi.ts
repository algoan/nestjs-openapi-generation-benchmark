import * as z from 'zod';
import { ZodOpenApiResponsesObject } from 'zod-openapi';

/**
 * zod-openapi building blocks shared by the `*.openapi.ts` definition files
 */

export const objectId = z.string();
export const dateTime = z.iso.datetime();

export const HttpError = z
  .object({ code: z.string(), message: z.string(), status: z.number() })
  .meta({ id: 'HttpError', description: 'Body sent by the global HttpExceptionFilter' });

const error = (description: string) => ({ description, content: { 'application/json': { schema: HttpError } } });

export const badRequest: ZodOpenApiResponsesObject = { 400: error('Invalid request') };
export const authErrors: ZodOpenApiResponsesObject = {
  401: error('Missing or invalid bearer token'),
  403: error('Missing role or shelter access'),
};
export const notFound: ZodOpenApiResponsesObject = { 404: error('Unknown entity') };
export const conflict: ZodOpenApiResponsesObject = { 409: error('Conflict with the current state of the resource') };

export const json = (schema: z.ZodType, description: string = 'Success') => ({
  description,
  content: { 'application/json': { schema } },
});
export const body = (schema: z.ZodType) => ({ required: true, content: { 'application/json': { schema } } });
export const noContent = { 204: { description: 'No content' } };

/** Query parameters read by `@PaginationParams({ perPageName: 'limit' })` */
export const PaginationQuery = z.object({
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
  .meta({ id: 'PaginationLinks' });

/** Body built by the PaginationBodyInterceptor */
export const paginated = (resource: z.ZodType) => z.object({ resources: z.array(resource), pagination: PaginationLinks });
