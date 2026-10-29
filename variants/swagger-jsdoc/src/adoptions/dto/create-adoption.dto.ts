import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';
import { Species } from '../../animals/enums/species.enum';
import { Adopter } from '../models/adopter.model';

const MAX_NOTES_LENGTH: number = 500;

/**
 * Create Adoption DTO
 * @openapi
 * components:
 *   schemas:
 *     CreateAdoptionDto:
 *       type: object
 *       required: [animalId, species, adopter, fee]
 *       properties:
 *         animalId:
 *           type: string
 *         species:
 *           $ref: '#/components/schemas/Species'
 *         adopter:
 *           $ref: '#/components/schemas/Adopter'
 *         fee:
 *           type: number
 *           minimum: 0
 *           description: Adoption fee, in euros
 *         notes:
 *           type: string
 *           maxLength: 500
 */
export class CreateAdoptionDto {
  @IsMongoId()
  public animalId: string;

  @IsEnum(Species)
  public species: Species;

  @IsDefined()
  @ValidateNested()
  @Type(() => Adopter)
  public adopter: Adopter;

  /**
   * Adoption fee, in euros
   */
  @IsNumber()
  @Min(0)
  public fee: number;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_NOTES_LENGTH)
  public notes?: string;
}
