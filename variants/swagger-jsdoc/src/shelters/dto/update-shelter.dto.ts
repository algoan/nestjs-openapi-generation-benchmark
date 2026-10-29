import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ShelterStatus } from '../enums/shelter-status.enum';
import { CreateShelterDto } from './create-shelter.dto';

/**
 * Update Shelter DTO: every field but the country can be updated
 * @openapi
 * components:
 *   schemas:
 *     UpdateShelterDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Display name of the shelter
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email
 *         capacity:
 *           type: integer
 *           minimum: 0
 *           maximum: 1000
 *           description: Maximum number of animals the shelter can host
 *         tags:
 *           type: array
 *           maxItems: 10
 *           items:
 *             type: string
 *         metadata:
 *           type: object
 *           description: Free-form data attached by the caller
 *         status:
 *           $ref: '#/components/schemas/ShelterStatus'
 */
export class UpdateShelterDto extends PartialType(OmitType(CreateShelterDto, ['country'] as const)) {
  @IsOptional()
  @IsEnum(ShelterStatus)
  public status?: ShelterStatus;
}
