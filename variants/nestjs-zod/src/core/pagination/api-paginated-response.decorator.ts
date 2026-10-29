import { applyDecorators, Type } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { HttpError } from '../interfaces/http-error.interface';
import { DEFAULT_LIMIT } from './pagination-param.decorator';
import { PaginationLinks } from './pagination.interfaces';

/**
 * Document the query parameters read by PaginationParams and the body built by the PaginationBodyInterceptor
 */
export const ApiPaginatedResponse = (model: Type<unknown>, perPageName: string = 'limit'): MethodDecorator =>
  applyDecorators(
    ApiExtraModels(model, PaginationLinks),
    ApiQuery({ name: 'page', required: false, schema: { type: 'integer', default: 1 } }),
    ApiQuery({ name: perPageName, required: false, schema: { type: 'integer', default: DEFAULT_LIMIT } }),
    ApiQuery({ name: 'filter', required: false, type: String, description: 'JSON-encoded Mongo filter' }),
    ApiQuery({ name: 'sort', required: false, type: String, description: 'JSON-encoded Mongo sort' }),
    ApiBadRequestResponse({ type: HttpError }),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['resources', 'pagination'],
        properties: {
          resources: { type: 'array', items: { $ref: getSchemaPath(model) } },
          pagination: { $ref: getSchemaPath(PaginationLinks) },
        },
      },
    }),
  );
