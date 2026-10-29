/**
 * Yearly statistics of a shelter
 * @openapi
 * components:
 *   schemas:
 *     ShelterStats:
 *       type: object
 *       required: [shelterId, year, hostedAnimals, adoptions, occupancyRate]
 *       properties:
 *         shelterId:
 *           type: string
 *         year:
 *           type: number
 *         hostedAnimals:
 *           type: number
 *           description: Number of animals currently hosted
 *         adoptions:
 *           type: object
 *           required: [approved, rejected, pending]
 *           properties:
 *             approved:
 *               type: number
 *             rejected:
 *               type: number
 *             pending:
 *               type: number
 *         occupancyRate:
 *           type: number
 *           description: Hosted animals / capacity, between 0 and 1
 */
export interface ShelterStats {
  shelterId: string;
  year: number;
  /**
   * Number of animals currently hosted
   */
  hostedAnimals: number;
  adoptions: {
    approved: number;
    rejected: number;
    pending: number;
  };
  /**
   * Hosted animals / capacity, between 0 and 1
   */
  occupancyRate: number;
}
