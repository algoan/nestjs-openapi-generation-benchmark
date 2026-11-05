import { Vaccination } from '../animals/models/vaccination.model';

/**
 * Payload of the `vaccination_recorded` Pub/Sub event, sent by the veterinary service
 */
export class VaccinationRecordedEvent {
  shelterId: string;
  animalId: string;
  vaccination: Vaccination;
}
