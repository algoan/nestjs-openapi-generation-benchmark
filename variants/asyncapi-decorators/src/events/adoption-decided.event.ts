import { ApiProperty } from 'asyncapi-decorators';
import { AdoptionRequestStatus } from '../adoptions/enums/adoption-request-status.enum';

/**
 * Payload of the `adoption_decided` Pub/Sub event
 */
export class AdoptionDecidedEvent {
  @ApiProperty()
  adoptionId: string;
  @ApiProperty()
  shelterId: string;
  @ApiProperty({ type: 'string', enum: Object.values(AdoptionRequestStatus) })
  status: AdoptionRequestStatus;
  /**
   * Why the request was rejected
   */
  @ApiProperty({ description: 'Why the request was rejected' })
  rejectionReason?: string;
  @ApiProperty({ format: 'date-time' })
  decidedAt: Date;
}
