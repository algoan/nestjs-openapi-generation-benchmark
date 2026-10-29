import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { codePointString } from '../../core/validation/code-point-string.schema';

/**
 * Reject Adoption DTO
 */
export class RejectAdoptionDto extends createZodDto(
  z.object({
    reason: codePointString({ min: 10, max: 500 }).describe('Why the request is rejected, sent to the adopter'),
  }),
) {}
