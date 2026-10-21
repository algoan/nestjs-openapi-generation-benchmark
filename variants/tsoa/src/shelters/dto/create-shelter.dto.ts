import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsEmail,
  IsInt,
  IsISO31661Alpha2,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Address } from '../models/address.model';

const MAX_NAME_LENGTH: number = 100;
const MAX_CAPACITY: number = 1000;
const MAX_TAGS: number = 10;

/**
 * Create Shelter DTO
 */
export class CreateShelterDto {
  /**
   * Display name of the shelter
   * @maxLength 100
   */
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  public name: string;

  /**
   * ISO 3166-1 alpha-2 country code
   */
  @IsISO31661Alpha2()
  public country: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  public address?: Address;

  /**
   * Contact email
   * @format email
   */
  @IsOptional()
  @IsEmail()
  public email?: string;

  /**
   * Maximum number of animals the shelter can host
   * @isInt
   * @minimum 0
   * @maximum 1000
   */
  @IsInt()
  @Min(0)
  @Max(MAX_CAPACITY)
  public capacity: number;

  /** @maxItems 10 */
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(MAX_TAGS)
  public tags?: string[];

  /**
   * Free-form data attached by the caller
   */
  @IsOptional()
  @IsObject()
  public metadata?: Record<string, unknown>;
}
