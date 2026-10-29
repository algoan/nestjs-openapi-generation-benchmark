import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CoatPattern } from '../enums/coat-pattern.enum';
import { createAnimalSchema } from './create-animal.dto';

export const createCatSchema = createAnimalSchema.extend({
  indoor: z.boolean().describe('Whether the cat must live indoors'),
  coatPattern: z.enum(CoatPattern).nullish(),
});

/**
 * Create Cat DTO
 */
export class CreateCatDto extends createZodDto(createCatSchema) {}
