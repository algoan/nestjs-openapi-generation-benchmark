import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AdoptionCompletedEvent } from './adoption-completed.event';

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
}
