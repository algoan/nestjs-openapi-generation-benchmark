/**
 * Animal species hosted by the shelters
 * @openapi
 * components:
 *   schemas:
 *     Species:
 *       type: string
 *       enum: [CAT, DOG]
 */
export enum Species {
  CAT = 'CAT',
  DOG = 'DOG',
}
