import { isISBN } from 'class-validator';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Species } from '../../animals/enums/species.enum';
import { isoDate } from '../../core/validation/iso-date.schema';
import { BookGenre } from '../enums/book-genre.enum';

const MAX_RATING: number = 5;
const MIN_BIRTH_YEAR: number = 1000;
const MAX_BIRTH_YEAR: number = 2100;

export const createBookSchema = z.object({
  isbn: z
    .string()
    .refine((isbn: string) => isISBN(isbn, 13))
    .describe('ISBN-13, without dashes'),
  title: z.string(),
  authors: z
    .array(
      z.object({
        name: z.string(),
        birthYear: z.number().int().min(MIN_BIRTH_YEAR).max(MAX_BIRTH_YEAR).optional(),
      }),
    )
    .min(1),
  genre: z.enum(BookGenre),
  publishedOn: isoDate.optional(),
  pageCount: z.number().int().min(1).optional(),
  language: z.string().length(2).optional().describe('ISO 639-1 language code'),
  topics: z.array(z.enum(Species)).optional().describe('Species the book is about'),
  rating: z.number().min(0).max(MAX_RATING).optional().describe('Average reader rating, from 0 to 5'),
  available: z.boolean().optional(),
});

/**
 * Create Book DTO
 */
export class CreateBookDto extends createZodDto(createBookSchema) {}
