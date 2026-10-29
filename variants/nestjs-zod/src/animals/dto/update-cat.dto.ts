import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { partialNullish } from '../../core/validation/partial-nullish';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { createCatSchema } from './create-cat.dto';

/**
 * Update Cat DTO
 */
export class UpdateCatDto extends createZodDto(partialNullish(createCatSchema).extend({ status: z.enum(AdoptionStatus).nullish() })) {}
