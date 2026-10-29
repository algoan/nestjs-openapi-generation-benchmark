/**
 * Whether a shelter currently welcomes new animals
 * @openapi
 * components:
 *   schemas:
 *     ShelterStatus:
 *       type: string
 *       enum: [OPEN, FULL, CLOSED]
 */
export enum ShelterStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CLOSED = 'CLOSED',
}
