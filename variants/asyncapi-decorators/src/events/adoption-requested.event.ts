import { ApiProperty } from 'asyncapi-decorators';
import { Species } from '../animals/enums/species.enum';
import { Adopter } from '../adoptions/models/adopter.model';

/**
 * Payload of the `adoption_requested` Pub/Sub event
 */
export class AdoptionRequestedEvent {
  @ApiProperty()
  adoptionId: string;
  @ApiProperty()
  shelterId: string;
  @ApiProperty()
  animalId: string;
  @ApiProperty({ type: 'string', enum: Object.values(Species) })
  species: Species;
  @ApiProperty()
  adopter: Adopter;
  /**
   * Adoption fee, in euros
   */
  @ApiProperty({ description: 'Adoption fee, in euros' })
  fee: number;
}
