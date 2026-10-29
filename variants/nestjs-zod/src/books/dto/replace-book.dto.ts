import { createZodDto } from 'nestjs-zod';
import { createBookSchema } from './create-book.dto';

/**
 * Replace Book DTO: the ISBN comes from the path
 */
export class ReplaceBookDto extends createZodDto(createBookSchema.omit({ isbn: true })) {}
