import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { setupApp } from './src/setup';

const NESTIA_CONFIG: INestiaConfig = {
  // preview: register the routes without instantiating the providers (no MongoDB connection)
  input: async () => setupApp(await NestFactory.create(AppModule, { preview: true, logger: false })),
  swagger: {
    output: 'openapi.json',
    openapi: '3.1',
    beautify: true,
    info: { title: 'Petstore API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
    security: { bearer: { type: 'http', scheme: 'bearer' } },
  },
};
export default NESTIA_CONFIG;
