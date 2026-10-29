import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BookGenre } from '../enums/book-genre.enum';

/**
 * Query parameters to search the catalogue
 */
export class SearchBooksDto extends createZodDto(
  z.object({
    search: z.string().optional().describe('Full-text search on the title and the authors'),
    genre: z.enum(BookGenre).optional(),
  }),
) {}
