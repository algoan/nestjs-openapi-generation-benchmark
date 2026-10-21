/**
 * Payload of the `adoption_completed` Pub/Sub event
 */
export interface AdoptionCompletedEvent {
  adoptionId: string;
  shelterId: string;
}
