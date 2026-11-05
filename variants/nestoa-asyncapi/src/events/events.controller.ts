import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AdoptionCompletedEvent } from './adoption-completed.event';
import { EventName } from './enums/event-name.enum';
import { VaccinationRecordedEvent } from './vaccination-recorded.event';

/**
 * Pub/Sub listener: no HTTP route, must not appear in the OpenAPI document
 */
@Controller()
export class EventsController {
  private readonly logger: Logger = new Logger(EventsController.name);

  /**
   * Handle the adoption_completed event
   */
  @EventPattern('adoption_completed')
  public async onAdoptionCompleted(@Payload() payload: AdoptionCompletedEvent): Promise<void> {
    this.logger.log(`Adoption ${payload.adoptionId} completed in shelter ${payload.shelterId}`);
  }

  /**
   * Add a vaccination to the health record of an animal
   */
  @EventPattern(EventName.VACCINATION_RECORDED)
  public async onVaccinationRecorded(@Payload() event: VaccinationRecordedEvent): Promise<void> {
    this.logger.log(`Animal ${event.animalId} vaccinated against ${event.vaccination.name}`);
  }

  /**
   * Update the availability of a book when the bookshop's stock changes
   */
  @EventPattern([EventName.BOOK_RESTOCKED, EventName.BOOK_SOLD_OUT])
  public async onBookStockChanged(@Payload('isbn') isbn: string, @Payload('stock') stock?: number): Promise<void> {
    this.logger.log(`Book ${isbn} stock: ${stock ?? 0}`);
  }
}
