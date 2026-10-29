/**
 * Lifecycle of an adoption request
 * @openapi
 * components:
 *   schemas:
 *     AdoptionRequestStatus:
 *       type: string
 *       enum: [PENDING, APPROVED, REJECTED]
 */
export enum AdoptionRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
