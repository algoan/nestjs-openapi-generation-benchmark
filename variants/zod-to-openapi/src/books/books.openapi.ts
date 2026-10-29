import { z } from 'zod';
import { Species } from '../animals/enums/species.enum';
import {
  authErrors,
  badRequest,
  conflict,
  dateTime,
  json,
  jsonBody,
  noContent,
  notFound,
  objectId,
  paginated,
  paginationQuery,
  registry,
  unprotected,
} from '../core/openapi';
import { BookGenre } from './enums/book-genre.enum';

const Author = z
  .object({ name: z.string(), birthYear: z.number().int().min(1000).max(2100).optional() })
  .openapi('Author');

const CreateBookDto = z
  .object({
    isbn: z.string().describe('ISBN-13, without dashes'),
    title: z.string(),
    authors: z.array(Author).min(1),
    genre: z.enum(BookGenre),
    publishedOn: dateTime.optional(),
    pageCount: z.number().int().min(1).optional(),
    language: z.string().length(2).optional().describe('ISO 639-1 language code'),
    topics: z.array(z.enum(Species)).optional().describe('Species the book is about'),
    rating: z.number().min(0).max(5).optional().describe('Average reader rating, from 0 to 5'),
    available: z.boolean().optional(),
  })
  .openapi('CreateBookDto');

const ReplaceBookDto = CreateBookDto.omit({ isbn: true }).openapi('ReplaceBookDto');

const Book = z
  .object({
    _id: objectId,
    isbn: z.string().describe('ISBN-13, without dashes'),
    title: z.string(),
    authors: z.array(Author),
    genre: z.enum(BookGenre),
    publishedOn: dateTime.optional(),
    pageCount: z.number().optional(),
    language: z.string().describe('ISO 639-1 language code'),
    topics: z.array(z.enum(Species)).describe('Species the book is about'),
    rating: z.number().optional().describe('Average reader rating, from 0 to 5'),
    available: z.boolean(),
    createdAt: dateTime.describe('Value added by mongoose'),
    updatedAt: dateTime.describe('Value added by mongoose'),
  })
  .openapi('Book');

const params = z.object({ isbn: z.string().describe('ISBN-13, without dashes') });

registry.registerPath({
  method: 'get',
  path: '/books',
  summary: 'Search the catalogue',
  security: unprotected,
  request: {
    query: paginationQuery.extend({
      search: z.string().optional().describe('Full-text search on the title and the authors'),
      genre: z.enum(BookGenre).optional(),
    }),
  },
  responses: { 200: json(paginated(Book)), ...badRequest },
});

registry.registerPath({
  method: 'get',
  path: '/books/export',
  summary: 'Export the whole catalogue as CSV',
  security: unprotected,
  responses: { 200: { description: 'Success', content: { 'text/csv': { schema: z.string() } } } },
});

registry.registerPath({
  method: 'get',
  path: '/books/{isbn}',
  summary: 'Get a book by ISBN',
  security: unprotected,
  request: { params },
  responses: { 200: json(Book), ...notFound },
});

registry.registerPath({
  method: 'post',
  path: '/books',
  summary: 'Add a book to the catalogue',
  request: { body: jsonBody(CreateBookDto) },
  responses: { 201: json(Book), ...badRequest, ...authErrors, ...conflict },
});

registry.registerPath({
  method: 'put',
  path: '/books/{isbn}',
  summary: 'Replace a book',
  request: { params, body: jsonBody(ReplaceBookDto) },
  responses: { 200: json(Book), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'delete',
  path: '/books/{isbn}',
  summary: 'Remove a book from the catalogue',
  request: { params },
  responses: { 204: noContent, ...authErrors, ...notFound },
});
