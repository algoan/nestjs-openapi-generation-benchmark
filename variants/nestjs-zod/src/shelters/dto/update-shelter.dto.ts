import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { partialNullish } from '../../core/validation/partial-nullish';
import { ShelterStatus } from '../enums/shelter-status.enum';
import { createShelterSchema } from './create-shelter.dto';

/**
 * Update Shelter DTO: every field but the country can be updated
 */
export class UpdateShelterDto extends createZodDto(
  partialNullish(createShelterSchema.omit({ country: true })).extend({ status: z.enum(ShelterStatus).nullish() }),
) {}
