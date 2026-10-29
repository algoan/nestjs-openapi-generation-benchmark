/**
 * @openapi
 * components:
 *   schemas:
 *     CoatPattern:
 *       type: string
 *       enum: [SOLID, TABBY, TORTOISESHELL, CALICO, BICOLOR]
 */
export enum CoatPattern {
  SOLID = 'SOLID',
  TABBY = 'TABBY',
  TORTOISESHELL = 'TORTOISESHELL',
  CALICO = 'CALICO',
  BICOLOR = 'BICOLOR',
}
