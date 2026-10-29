import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { DogSize } from '../enums/dog-size.enum';
import { createAnimalSchema } from './create-animal.dto';

/**
 * Create Dog DTO
 */
export class CreateDogDto extends createZodDto(
  createAnimalSchema.extend({
    breed: z.string(),
    size: z.enum(DogSize),
    goodWithKids: z.boolean().optional(),
  }),
) {}
