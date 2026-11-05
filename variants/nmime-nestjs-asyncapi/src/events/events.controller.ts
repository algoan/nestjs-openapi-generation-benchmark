import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AsyncApiSub } from '@nmime/nestjs-asyncapi';
import { AdoptionCompletedEvent } from './adoption-completed.event';
import { BookStockChangedEvent } from './book-stock-changed.event';
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
  @AsyncApiSub({
    channel: 'adoption_completed',
    summary: 'Handle the adoption_completed event',
    message: { payload: AdoptionCompletedEvent },
  })
  public async onAdoptionCompleted(@Payload() payload: AdoptionCompletedEvent): Promise<void> {
    this.logger.log(`Adoption ${payload.adoptionId} completed in shelter ${payload.shelterId}`);
  }

  /**
   * Add a vaccination to the health record of an animal
   */
  @EventPattern(EventName.VACCINATION_RECORDED)
  @AsyncApiSub({
    channel: EventName.VACCINATION_RECORDED,
    summary: 'Add a vaccination to the health record of an animal',
    message: { payload: VaccinationRecordedEvent },
  })
  public async onVaccinationRecorded(@Payload() event: VaccinationRecordedEvent): Promise<void> {
    this.logger.log(`Animal ${event.animalId} vaccinated against ${event.vaccination.name}`);
  }

  /**
   * Update the availability of a book when the bookshop's stock changes
   */
  @EventPattern([EventName.BOOK_RESTOCKED, EventName.BOOK_SOLD_OUT])
  @AsyncApiSub(
    ...[EventName.BOOK_RESTOCKED, EventName.BOOK_SOLD_OUT].map((channel: EventName) => ({
      channel,
      summary: "Update the availability of a book when the bookshop's stock changes",
      message: { payload: BookStockChangedEvent },
    })),
  )
  public async onBookStockChanged(@Payload('isbn') isbn: string, @Payload('stock') stock?: number): Promise<void> {
    this.logger.log(`Book ${isbn} stock: ${stock ?? 0}`);
  }
}
