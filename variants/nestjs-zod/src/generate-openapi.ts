import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AppModule } from './app.module';
import { setupApp } from './setup';

/**
 * Build the OpenAPI document without connecting to MongoDB nor listening to a port
 */
const generate = async (): Promise<void> => {
  const app = setupApp(await NestFactory.create(AppModule, { preview: true, logger: false }));
  const config = new DocumentBuilder().setTitle('Petstore API').setVersion('1.0.0').addBearerAuth().build();
  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
  // Mongo ObjectIds (path params parsed by ParseObjectIdPipe) are sent as 24-char hex strings
  document.components!.schemas!.ObjectId = { type: 'string' };
  writeFileSync('openapi.json', JSON.stringify(document, null, 2));
  await app.close();
};

void generate();
