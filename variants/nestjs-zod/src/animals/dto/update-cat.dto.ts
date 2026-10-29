import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { createCatSchema } from './create-cat.dto';

/**
 * Update Cat DTO
 */
export class UpdateCatDto extends createZodDto(createCatSchema.partial().extend({ status: z.enum(AdoptionStatus).optional() })) {}
