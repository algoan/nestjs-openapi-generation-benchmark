// Generate openapi.json with typoa (static analysis of the controllers, no build needed)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { generate } = require('typoa');

const OUTPUT = path.resolve(__dirname, 'openapi.json');
// typoa always generates an express router: we do not use it, so it goes to a temporary directory
const routerDir = fs.mkdtempSync(path.join(os.tmpdir(), 'typoa-'));

generate({
  tsconfigFilePath: path.resolve(__dirname, 'tsconfig.json'),
  controllers: [path.resolve(__dirname, 'src/**/*.controller.ts')],
  openapi: {
    filePath: OUTPUT,
    service: { name: 'petstore-app', version: '1.0.0' },
    securitySchemes: { bearer: { type: 'http', scheme: 'bearer' } },
  },
  router: { filePath: path.join(routerDir, 'router.ts') },
})
  .then(() => {
    const spec = JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
    // NestJS routes use the express `:param` syntax: convert it to OpenAPI `{param}`
    spec.paths = Object.fromEntries(
      Object.entries(spec.paths).map(([p, item]) => [p.replace(/:(\w+)/g, '{$1}'), item]),
    );
    // NestJS global prefix (app.setGlobalPrefix)
    spec.servers = [{ url: '/v1' }];
    // typoa closes every object (`additionalProperties: false`), but the API does not reject unknown properties
    // (the ValidationPipe strips them): remove it
    const open = (node) => {
      if (node === null || typeof node !== 'object') return;
      if (node.additionalProperties === false) delete node.additionalProperties;
      Object.values(node).forEach(open);
    };
    open(spec.components.schemas);
    fs.writeFileSync(OUTPUT, JSON.stringify(spec, null, 2));
  })
  .finally(() => fs.rmSync(routerDir, { recursive: true, force: true }));
