import { DocumentationBuilder } from 'asyncapi-decorators';
import { writeFileSync } from 'node:fs';
import './adoptions/adoptions.service';
import './books/books.service';
import './events/events.controller';

const document: string = new DocumentationBuilder()
  .setTitle('Petstore events')
  .setVersion('1.0.0')
  .setDefaultContentType('application/json')
  .toYAML();

writeFileSync('asyncapi.yaml', document);
