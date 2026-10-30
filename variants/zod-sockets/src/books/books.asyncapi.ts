import * as z from 'zod';
import { Species } from '../animals/enums/species.enum';
import { EventName } from '../events/enums/event-name.enum';
import { BookGenre } from './enums/book-genre.enum';

const Author = z
  .object({ name: z.string(), birthYear: z.number().int().min(1000).max(2100).optional() })
  .describe('Book author');

const Book = z
  .object({
    _id: z.string(),
    isbn: z.string().describe('ISBN-13, without dashes'),
    title: z.string(),
    authors: z.array(Author),
    genre: z.enum(BookGenre),
    publishedOn: z.iso.datetime().optional(),
    pageCount: z.number().optional(),
    language: z.string().describe('ISO 639-1 language code'),
    topics: z.array(z.enum(Species)).describe('Species the book is about'),
    rating: z.number().optional().describe('Average reader rating, from 0 to 5'),
    available: z.boolean(),
    createdAt: z.iso.datetime().describe('Value added by mongoose'),
    updatedAt: z.iso.datetime().describe('Value added by mongoose'),
  })
  .describe('A book of the pet-care catalogue');

export const bookEmission = {
  [EventName.BOOK_PUBLISHED]: { schema: z.tuple([Book]) },
};
