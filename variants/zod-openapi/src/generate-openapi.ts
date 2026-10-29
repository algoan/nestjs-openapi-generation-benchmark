import { writeFileSync } from 'node:fs';
import { createDocument } from 'zod-openapi';
import { adoptionPaths } from './adoptions/adoptions.openapi';
import { animalPaths } from './animals/animals.openapi';
import { appPaths } from './app.openapi';
import { bookPaths } from './books/books.openapi';
import { shelterPaths } from './shelters/shelters.openapi';

const document = createDocument(
  {
    openapi: '3.1.0',
    info: { title: 'Petstore API', version: '1.0.0' },
    components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearer: [] }],
    paths: { ...appPaths, ...shelterPaths, ...animalPaths, ...adoptionPaths, ...bookPaths },
  },
  {
    // drop what Zod adds on its own: safe-integer bounds of .int(), regexes of string formats, closed response objects
    override: ({ jsonSchema }) => {
      if (jsonSchema.minimum === Number.MIN_SAFE_INTEGER) delete jsonSchema.minimum;
      if (jsonSchema.maximum === Number.MAX_SAFE_INTEGER) delete jsonSchema.maximum;
      if (jsonSchema.format) delete jsonSchema.pattern;
      if (jsonSchema.additionalProperties === false) delete jsonSchema.additionalProperties;
    },
  },
);

writeFileSync('openapi.json', JSON.stringify(document, null, 2));
