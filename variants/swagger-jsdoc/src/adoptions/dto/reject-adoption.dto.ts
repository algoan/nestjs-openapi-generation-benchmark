import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Reject Adoption DTO
 * @openapi
 * components:
 *   schemas:
 *     RejectAdoptionDto:
 *       type: object
 *       required: [reason]
 *       properties:
 *         reason:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: Why the request is rejected, sent to the adopter
 */
export class RejectAdoptionDto {
  /**
   * Why the request is rejected, sent to the adopter
   */
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  public reason: string;
}
