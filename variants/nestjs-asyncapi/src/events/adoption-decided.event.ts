import { AdoptionRequestStatus } from '../adoptions/enums/adoption-request-status.enum';

/**
 * Payload of the `adoption_decided` Pub/Sub event
 */
export class AdoptionDecidedEvent {
  adoptionId: string;
  shelterId: string;
  status: AdoptionRequestStatus;
  /**
   * Why the request was rejected
   */
  rejectionReason?: string;
  decidedAt: Date;
}
