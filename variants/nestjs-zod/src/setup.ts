import { INestApplication } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { GLOBAL_PREFIX } from './constants';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

/**
 * Attach the global dependencies (shared by main.ts and the e2e tests)
 */
export const setupApp = (app: INestApplication): INestApplication => {
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(GLOBAL_PREFIX);

  return app;
};
