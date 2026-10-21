import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsISBN,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Species } from '../../animals/enums/species.enum';
import { BookGenre } from '../enums/book-genre.enum';
import { Author } from '../models/author.model';

const MAX_RATING: number = 5;

/**
 * Create Book DTO
 */
export class CreateBookDto {
  /**
   * ISBN-13, without dashes
   */
  @IsISBN(13)
  public isbn: string;

  @IsString()
  public title: string;

  /** @minItems 1 */
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Author)
  public authors: Author[];

  @IsEnum(BookGenre)
  public genre: BookGenre;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public publishedOn?: Date;

  /**
   * @isInt
   * @minimum 1
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  public pageCount?: number;

  /**
   * ISO 639-1 language code
   * @minLength 2
   * @maxLength 2
   */
  @IsOptional()
  @IsString()
  @Length(2, 2)
  public language?: string;

  /**
   * Species the book is about
   */
  @IsOptional()
  @IsEnum(Species, { each: true })
  public topics?: Species[];

  /**
   * Average reader rating, from 0 to 5
   * @minimum 0
   * @maximum 5
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(MAX_RATING)
  public rating?: number;

  @IsOptional()
  @IsBoolean()
  public available?: boolean;
}
