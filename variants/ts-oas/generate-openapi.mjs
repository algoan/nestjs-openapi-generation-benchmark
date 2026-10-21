import { writeFileSync } from 'node:fs';
import { createProgram, TsOAS } from 'ts-oas';

const OBJECT_ID_REF = '#/components/schemas/ObjectId';

const program = createProgram(['src/**/*.api.ts'], 'tsconfig.json', process.cwd());
const tsoas = new TsOAS(program, {
  ref: true,
  defaultContentType: 'application/json',
  customKeywords: ['required'], // allows `@body.required true`
  customKeywordPrefix: '',
  // Mongo ObjectIds are serialized as strings
  schemaProcessor: (schema) => (schema.$ref === OBJECT_ID_REF ? { type: 'string' } : schema),
});
const spec = tsoas.getOpenApiSpec([/API$/], {
  openapi: '3.1.0',
  info: { title: 'Petstore API', version: '1.0.0' },
  components: { securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } } },
  security: [{ bearer: [] }],
});
delete spec.components.schemas.ObjectId;

writeFileSync('openapi.json', JSON.stringify(spec, null, 2));
