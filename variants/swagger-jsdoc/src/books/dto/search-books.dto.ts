import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookGenre } from '../enums/book-genre.enum';

/**
 * Query parameters to search the catalogue
 * @openapi
 * components:
 *   schemas:
 *     SearchBooksDto:
 *       type: object
 *       properties:
 *         search:
 *           type: string
 *           description: Full-text search on the title and the authors
 *         genre:
 *           $ref: '#/components/schemas/BookGenre'
 */
export class SearchBooksDto {
  /**
   * Full-text search on the title and the authors
   */
  @IsOptional()
  @IsString()
  public search?: string;

  @IsOptional()
  @IsEnum(BookGenre)
  public genre?: BookGenre;
}
