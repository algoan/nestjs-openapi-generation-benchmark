import { SwaggerCustomizer } from '@nestia/core';
import typia from 'typia';
import { HttpError } from '../interfaces/http-error.interface';

const DESCRIPTIONS: Record<number, string> = {
  400: 'Invalid request',
  401: 'Missing or invalid bearer token',
  403: 'Missing role',
  404: 'Unknown entity',
  409: 'Conflict with the current state of the entity',
};

/**
 * Document error responses, formatted by the HttpExceptionFilter (only read by `nestia swagger`)
 */
export const ApiErrors = (...statuses: number[]): MethodDecorator =>
  SwaggerCustomizer(({ swagger, route }: SwaggerCustomizer.IProps): void => {
    const error = typia.json.schema<HttpError>();
    Object.assign((swagger.components.schemas ??= {}), error.components.schemas);
    for (const status of statuses) {
      route.responses = {
        ...route.responses,
        [status]: { description: DESCRIPTIONS[status], content: { 'application/json': { schema: error.schema } } },
      };
    }
  });
