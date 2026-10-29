import { isEmail, isMongoId, isPhoneNumber } from 'class-validator';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Species } from '../../animals/enums/species.enum';

const MAX_NAME_LENGTH: number = 80;
const MAX_NOTES_LENGTH: number = 500;

const adopterSchema = z.object({
  firstName: z.string().max(MAX_NAME_LENGTH),
  lastName: z.string().max(MAX_NAME_LENGTH),
  email: z.string().refine((email: string) => isEmail(email)).meta({ format: 'email' }),
  phone: z
    .string()
    .refine((phone: string) => isPhoneNumber(phone))
    .nullish()
    .describe('Phone number, in the E.164 format'),
});

/**
 * Create Adoption DTO
 */
export class CreateAdoptionDto extends createZodDto(
  z.object({
    animalId: z.string().refine(isMongoId),
    species: z.enum(Species),
    adopter: adopterSchema,
    fee: z.number().min(0).describe('Adoption fee, in euros'),
    notes: z.string().max(MAX_NOTES_LENGTH).nullish(),
  }),
) {}
