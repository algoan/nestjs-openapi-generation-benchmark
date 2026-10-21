import { SwaggerCustomizer } from '@nestia/core';
import typia from 'typia';
import { DEFAULT_LIMIT, DEFAULT_PAGE_NAME, DEFAULT_PER_PAGE_NAME } from './pagination-param.decorator';
import { PaginationLinks, PaginationOptions } from './pagination.interfaces';

/**
 * Document a route paginated by PaginationParams + PaginationBodyInterceptor (only read by `nestia swagger`):
 * add the pagination query parameters, and turn the `DataToPaginate<T>` response into a `PaginatedData<T>`
 */
export const ApiPaginated = (options: PaginationOptions = {}): MethodDecorator =>
  SwaggerCustomizer(({ swagger, route }: SwaggerCustomizer.IProps): void => {
    const query = (name: string, schema: object, description: string): object => ({ name, in: 'query', required: false, schema, description });
    route.parameters = [
      ...(route.parameters ?? []),
      query(options.pageName ?? DEFAULT_PAGE_NAME, { type: 'integer', default: 1 }, 'Page number'),
      query(options.perPageName ?? DEFAULT_PER_PAGE_NAME, { type: 'integer', default: options.defaultLimit ?? DEFAULT_LIMIT }, 'Page size'),
      query('filter', { type: 'string' }, 'JSON-encoded Mongo filter'),
      query('sort', { type: 'string' }, 'JSON-encoded Mongo sort, e.g. {"createdAt":-1}'),
    ] as typeof route.parameters;

    const content = route.responses?.['200']?.content?.['application/json'];
    const name = (content?.schema as { $ref?: string } | undefined)?.$ref?.split('/').pop();
    const schemas = (swagger.components.schemas ??= {});
    if (content === undefined || name === undefined || schemas[name] === undefined) {
      return;
    }
    const links = typia.json.schema<PaginationLinks>();
    Object.assign(schemas, links.components.schemas);
    const target: string = name.replace(/^DataToPaginate/, 'PaginatedData');
    schemas[target] = {
      type: 'object',
      properties: {
        resources: (schemas[name] as { properties: Record<string, object> }).properties.resources,
        pagination: links.schema,
      },
      required: ['resources', 'pagination'],
      description: 'Body of a paginated response, built by the PaginationBodyInterceptor',
    } as (typeof schemas)[string];
    delete schemas[name];
    content.schema = { $ref: `#/components/schemas/${target}` };
  });
