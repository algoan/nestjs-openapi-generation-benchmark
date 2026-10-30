import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';

/**
 * Receipt returned when an adoption request is filed
 */
export interface AdoptionReceipt {
  adoptionId: string;
  status: AdoptionRequestStatus;
  /**
   * When the shelter commits to answer
   */
  expectedDecisionDate: Date;
}
