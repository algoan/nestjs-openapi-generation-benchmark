import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { CreateCatDto } from './create-cat.dto';

/**
 * Update Cat DTO
 * @openapi
 * components:
 *   schemas:
 *     UpdateCatDto:
 *       type: object
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
 *         indoor:
 *           type: boolean
 *           description: Whether the cat must live indoors
 *         coatPattern:
 *           $ref: '#/components/schemas/CoatPattern'
 *         status:
 *           $ref: '#/components/schemas/AdoptionStatus'
 */
export class UpdateCatDto extends PartialType(CreateCatDto) {
  @IsOptional()
  @IsEnum(AdoptionStatus)
  public status?: AdoptionStatus;
}
