import { z } from 'zod';
import { isoDate } from '../../core/validation/iso-date.schema';
import { Sex } from '../enums/sex.enum';

const MAX_NAME_LENGTH: number = 50;

/**
 * Fields shared by every animal creation
 */
export const createAnimalSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH),
  birthDate: isoDate.optional(),
  sex: z.enum(Sex),
  vaccinations: z
    .array(
      z.object({
        name: z.string().describe('Vaccine name'),
        date: isoDate,
        expiresAt: isoDate.optional(),
      }),
    )
    .optional(),
  weightKg: z.number().min(0).optional().describe('Weight in kilograms'),
});
