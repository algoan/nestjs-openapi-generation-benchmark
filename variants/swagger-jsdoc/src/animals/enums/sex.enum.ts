/**
 * @openapi
 * components:
 *   schemas:
 *     Sex:
 *       type: string
 *       enum: [FEMALE, MALE, UNKNOWN]
 */
export enum Sex {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  UNKNOWN = 'UNKNOWN',
}
