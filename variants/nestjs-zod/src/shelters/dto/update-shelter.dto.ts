import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ShelterStatus } from '../enums/shelter-status.enum';
import { createShelterSchema } from './create-shelter.dto';

/**
 * Update Shelter DTO: every field but the country can be updated
 */
export class UpdateShelterDto extends createZodDto(
  createShelterSchema
    .omit({ country: true })
    .partial()
    .extend({ status: z.enum(ShelterStatus).optional() }),
) {}
