import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { Sex } from '../enums/sex.enum';
import { Vaccination } from '../models/vaccination.model';

const MAX_NAME_LENGTH: number = 50;

/**
 * Fields shared by every animal creation
 * @openapi
 * components:
 *   schemas:
 *     CreateAnimalDto:
 *       type: object
 *       required: [name, sex]
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 50
 *         birthDate:
 *           type: string
 *           format: date-time
 *         sex:
 *           $ref: '#/components/schemas/Sex'
 *         vaccinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vaccination'
 *         weightKg:
 *           type: number
 *           minimum: 0
 *           description: Weight in kilograms
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
