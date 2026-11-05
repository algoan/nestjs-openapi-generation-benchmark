import { ApiProperty } from 'asyncapi-decorators';

/**
 * Payload of the `adoption_completed` Pub/Sub event
 */
export class AdoptionCompletedEvent {
  @ApiProperty()
  adoptionId: string;
  @ApiProperty()
  shelterId: string;
}
