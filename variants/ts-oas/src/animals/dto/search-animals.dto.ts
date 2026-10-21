import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { Species } from '../enums/species.enum';

const MAX_NAME_LENGTH: number = 50;

/**
 * Query parameters to search the animals of a shelter
 */
export class SearchAnimalsDto {
  @IsOptional()
  @IsEnum(Species)
  public species?: Species;

  @IsOptional()
  @IsEnum(AdoptionStatus)
  public status?: AdoptionStatus;

  /**
   * Case-insensitive prefix of the animal name
   * @maxLength 50
   */
  @IsOptional()
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  public name?: string;

  /**
   * Minimum age, in years
   * @type integer
   * @minimum 0
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  public minAge?: number;
}
