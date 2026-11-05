import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { Sex } from '../enums/sex.enum';
import { Vaccination } from '../models/vaccination.model';

const MAX_NAME_LENGTH: number = 50;

/**
 * Fields shared by every animal creation
 */
export abstract class CreateAnimalDto {
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  public name: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public birthDate?: Date;

  @IsEnum(Sex)
  public sex: Sex;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Vaccination)
  public vaccinations?: Vaccination[];

  /**
   * Weight in kilograms
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  public weightKg?: number;
}
