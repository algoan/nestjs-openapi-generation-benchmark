import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { codePointString } from '../../core/validation/code-point-string.schema';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { Species } from '../enums/species.enum';

const MAX_NAME_LENGTH: number = 50;

/**
 * Query parameters to search the animals of a shelter
 */
export class SearchAnimalsDto extends createZodDto(
  z.object({
    species: z.enum(Species).optional(),
    status: z.enum(AdoptionStatus).optional(),
    name: codePointString({ max: MAX_NAME_LENGTH }).optional().describe('Case-insensitive prefix of the animal name'),
    minAge: z.coerce.number().int().min(0).optional().describe('Minimum age, in years'),
  }),
) {}
