import { ApiProperty } from 'asyncapi-decorators';
import { Vaccination } from '../animals/models/vaccination.model';

/**
 * Payload of the `vaccination_recorded` Pub/Sub event, sent by the veterinary service
 */
export class VaccinationRecordedEvent {
  @ApiProperty()
  shelterId: string;
  @ApiProperty()
  animalId: string;
  @ApiProperty()
  vaccination: Vaccination;
}
