import { Species } from '../animals/enums/species.enum';
import { Adopter } from '../adoptions/models/adopter.model';

/**
 * Payload of the `adoption_requested` Pub/Sub event
 */
export class AdoptionRequestedEvent {
  adoptionId: string;
  shelterId: string;
  animalId: string;
  species: Species;
  adopter: Adopter;
  /**
   * Adoption fee, in euros
   */
  fee: number;
}
