import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { writeFileSync } from 'node:fs';
import { GLOBAL_PREFIX } from './constants';
import { registry } from './core/openapi';
import './adoptions/adoptions.openapi';
import './animals/animals.openapi';
import './app.openapi';
import './books/books.openapi';
import './shelters/shelters.openapi';

const document = new OpenApiGeneratorV31(registry.definitions).generateDocument({
  openapi: '3.1.0',
  info: { title: 'Petstore API', version: '1.0.0' },
  servers: [{ url: `/${GLOBAL_PREFIX}` }],
  security: [{ bearer: [] }],
});

writeFileSync('openapi.json', JSON.stringify(document, null, 2));
