import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Reject Adoption DTO
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
