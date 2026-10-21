import { AuthErrors, BadRequest, Conflict, NotFound, PaginationQuery, Public } from '../core/openapi';
import { PaginatedData } from '../core/pagination';
import { CreateBookDto } from './dto/create-book.dto';
import { ReplaceBookDto } from './dto/replace-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { Book } from './models/book.model';

interface IsbnParams {
  /** ISBN-13, without dashes */
  isbn: string;
}

interface FindAllBooksQuery extends SearchBooksDto, PaginationQuery {}

/**
 * Search the catalogue
 */
export type FindAllBooksAPI = {
  path: '/v1/books';
  method: 'GET';
  query: FindAllBooksQuery;
  responses: { 200: PaginatedData<Book> } & BadRequest;
  security: Public;
};

/**
 * Export the whole catalogue as CSV
 */
export type ExportBooksAPI = {
  path: '/v1/books/export';
  method: 'GET';
  responses: {
    /** @contentType text/csv */
    200: string;
  };
  security: Public;
};

/**
 * Get a book by ISBN
 */
export type FindOneBookAPI = {
  path: '/v1/books/{isbn}';
  method: 'GET';
  params: IsbnParams;
  responses: { 200: Book } & NotFound;
  security: Public;
};

/**
 * Add a book to the catalogue
 * @body.required true
 */
export type CreateBookAPI = {
  path: '/v1/books';
  method: 'POST';
  body: CreateBookDto;
  responses: { 201: Book } & BadRequest & AuthErrors & Conflict;
};

/**
 * Replace a book
 * @body.required true
 */
export type ReplaceBookAPI = {
  path: '/v1/books/{isbn}';
  method: 'PUT';
  params: IsbnParams;
  body: ReplaceBookDto;
  responses: { 200: Book } & BadRequest & AuthErrors & NotFound;
};

/**
 * Remove a book from the catalogue
 */
export type RemoveBookAPI = {
  path: '/v1/books/{isbn}';
  method: 'DELETE';
  params: IsbnParams;
  responses: { 204: never } & AuthErrors & NotFound;
};
