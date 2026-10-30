/**
 * Payload of the `adoption_completed` Pub/Sub event
 */
export class AdoptionCompletedEvent {
  adoptionId: string;
  shelterId: string;
}
