/**
 * @openapi
 * components:
 *   schemas:
 *     BookGenre:
 *       type: string
 *       enum: [CARE_GUIDE, TRAINING, NOVEL, CHILDREN]
 */
export enum BookGenre {
  CARE_GUIDE = 'CARE_GUIDE',
  TRAINING = 'TRAINING',
  NOVEL = 'NOVEL',
  CHILDREN = 'CHILDREN',
}
