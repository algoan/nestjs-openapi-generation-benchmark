import { writeFileSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { AppModule } from './app.module';

/**
 * Build the AsyncAPI document without connecting to MongoDB nor listening to a port
 */
const generate = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { preview: true, logger: false });
  const config = new AsyncApiDocumentBuilder()
    .setTitle('Petstore events')
    .setVersion('1.0.0')
    .setDefaultContentType('application/json')
    .build();
  writeFileSync('asyncapi.json', JSON.stringify(AsyncApiModule.createDocument(app, config), null, 2));
  await app.close();
};

void generate();
