import { z } from 'zod';
import { codePointString } from '../../core/validation/code-point-string.schema';
import { isoDate } from '../../core/validation/iso-date.schema';
import { Sex } from '../enums/sex.enum';

const MAX_NAME_LENGTH: number = 50;

/**
 * Fields shared by every animal creation
 */
export const createAnimalSchema = z.object({
  name: codePointString({ max: MAX_NAME_LENGTH }),
  birthDate: isoDate.nullish(),
  sex: z.enum(Sex),
  vaccinations: z
    .array(
      z.object({
        name: z.string().describe('Vaccine name'),
        date: isoDate,
        expiresAt: isoDate.nullish(),
      }),
    )
    .nullish(),
  weightKg: z.number().min(0).nullish().describe('Weight in kilograms'),
});
