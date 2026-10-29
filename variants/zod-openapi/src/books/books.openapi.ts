import * as z from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import { Species } from '../animals/enums/species.enum';
import {
  authErrors,
  badRequest,
  body,
  conflict,
  dateTime,
  json,
  noContent,
  notFound,
  objectId,
  paginated,
  PaginationQuery,
} from '../core/openapi';
import { BookGenre } from './enums/book-genre.enum';

const Author = z
  .object({ name: z.string(), birthYear: z.number().int().min(1000).max(2100).optional() })
  .meta({ id: 'Author', description: 'Book author' });

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
  .meta({ id: 'CreateBookDto', description: 'Create Book DTO' });

const ReplaceBookDto = CreateBookDto.omit({ isbn: true }).meta({
  id: 'ReplaceBookDto',
  description: 'Replace Book DTO: the ISBN comes from the path',
});

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
  .meta({ id: 'Book', description: 'A book of the pet-care catalogue' });

const SearchBooksQuery = PaginationQuery.extend({
  search: z.string().optional().describe('Full-text search on the title and the authors'),
  genre: z.enum(BookGenre).optional(),
});

const isbn = z.object({ isbn: z.string().describe('ISBN-13, without dashes') });

export const bookPaths: ZodOpenApiPathsObject = {
  '/v1/books': {
    get: {
      summary: 'Search the catalogue',
      security: [],
      requestParams: { query: SearchBooksQuery },
      responses: { 200: json(paginated(Book)), ...badRequest },
    },
    post: {
      summary: 'Add a book to the catalogue',
      requestBody: body(CreateBookDto),
      responses: { 201: json(Book), ...badRequest, ...authErrors, ...conflict },
    },
  },
  '/v1/books/export': {
    get: {
      summary: 'Export the whole catalogue as CSV',
      security: [],
      responses: { 200: { description: 'Success', content: { 'text/csv': { schema: z.string() } } } },
    },
  },
  '/v1/books/{isbn}': {
    get: {
      summary: 'Get a book by ISBN',
      security: [],
      requestParams: { path: isbn },
      responses: { 200: json(Book), ...notFound },
    },
    put: {
      summary: 'Replace a book',
      requestParams: { path: isbn },
      requestBody: body(ReplaceBookDto),
      responses: { 200: json(Book), ...badRequest, ...authErrors, ...notFound },
    },
    delete: {
      summary: 'Remove a book from the catalogue',
      requestParams: { path: isbn },
      responses: { ...noContent, ...authErrors, ...notFound },
    },
  },
};
