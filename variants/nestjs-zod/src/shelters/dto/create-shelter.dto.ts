import { isEmail, isISO31661Alpha2 } from 'class-validator';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const MAX_NAME_LENGTH: number = 100;
const MAX_CAPACITY: number = 1000;
const MAX_TAGS: number = 10;
const MAX_LINE_LENGTH: number = 120;

export const createShelterSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH).describe('Display name of the shelter'),
  country: z.string().refine(isISO31661Alpha2).describe('ISO 3166-1 alpha-2 country code'),
  address: z
    .object({
      street: z.string().max(MAX_LINE_LENGTH),
      city: z.string(),
      postalCode: z.string(),
      complement: z.string().nullish().describe('Building, floor, etc.'),
    })
    .nullish(),
  email: z
    .string()
    .refine((email: string) => isEmail(email))
    .meta({ format: 'email' })
    .nullish().describe('Contact email'),
  capacity: z.number().int().min(0).max(MAX_CAPACITY).describe('Maximum number of animals the shelter can host'),
  tags: z.array(z.string()).max(MAX_TAGS).nullish(),
  metadata: z.record(z.string(), z.unknown()).nullish().describe('Free-form data attached by the caller'),
});

/**
 * Create Shelter DTO
 */
export class CreateShelterDto extends createZodDto(createShelterSchema) {}
