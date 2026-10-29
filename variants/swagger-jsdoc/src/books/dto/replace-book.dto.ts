import { OmitType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

/**
 * Replace Book DTO: the ISBN comes from the path
 * @openapi
 * components:
 *   schemas:
 *     ReplaceBookDto:
 *       type: object
 *       required: [title, authors, genre]
 *       properties:
 *         title:
 *           type: string
 *         authors:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/Author'
 *         genre:
 *           $ref: '#/components/schemas/BookGenre'
 *         publishedOn:
 *           type: string
 *           format: date-time
 *         pageCount:
 *           type: integer
 *           minimum: 1
 *         language:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           description: ISO 639-1 language code
 *         topics:
 *           type: array
 *           description: Species the book is about
 *           items:
 *             $ref: '#/components/schemas/Species'
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Average reader rating, from 0 to 5
 *         available:
 *           type: boolean
 */
export class ReplaceBookDto extends OmitType(CreateBookDto, ['isbn'] as const) {}
