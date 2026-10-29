import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Reject Adoption DTO
 */
export class RejectAdoptionDto extends createZodDto(
  z.object({
    reason: z.string().min(10).max(500).describe('Why the request is rejected, sent to the adopter'),
  }),
) {}
