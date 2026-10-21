import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';

/**
 * Receipt returned when an adoption request is filed
 */
export class AdoptionReceipt {
  adoptionId: string;
  status: AdoptionRequestStatus;
  /**
   * When the shelter commits to answer
   */
  expectedDecisionDate: Date;
}
