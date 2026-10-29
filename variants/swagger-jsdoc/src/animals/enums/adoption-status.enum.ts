/**
 * Adoption status of an animal
 * @openapi
 * components:
 *   schemas:
 *     AdoptionStatus:
 *       type: string
 *       enum: [AVAILABLE, RESERVED, ADOPTED]
 */
export enum AdoptionStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  ADOPTED = 'ADOPTED',
}
