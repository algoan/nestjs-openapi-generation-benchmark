/**
 * Yearly statistics of a shelter
 */
export class ShelterStats {
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
