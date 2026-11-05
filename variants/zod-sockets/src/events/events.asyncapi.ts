import * as z from 'zod';
import { ActionsFactory, createSimpleConfig } from 'zod-sockets';
import { adoptionEmission } from '../adoptions/adoptions.asyncapi';
import { bookEmission } from '../books/books.asyncapi';
import { EventName } from './enums/event-name.enum';

/** Outgoing events: the topics published with ClientProxy.emit() */
export const config = createSimpleConfig({ emission: { ...adoptionEmission, ...bookEmission } });

const factory = new ActionsFactory(config);

const AdoptionCompletedEvent = z
  .object({ adoptionId: z.string(), shelterId: z.string() })
  .describe('Payload of the `adoption_completed` Pub/Sub event');

const Vaccination = z
  .object({
    name: z.string().describe('Vaccine name'),
    date: z.iso.datetime(),
    expiresAt: z.iso.datetime().optional(),
  })
  .describe('A vaccine injection');

const VaccinationRecordedEvent = z
  .object({ shelterId: z.string(), animalId: z.string(), vaccination: Vaccination })
  .describe('Payload of the `vaccination_recorded` Pub/Sub event, sent by the veterinary service');

const BookStockChanged = z.object({ isbn: z.string(), stock: z.number().optional() });

// Incoming events: documentation only, the @EventPattern handlers of EventsController do the work
const noop = async (): Promise<void> => undefined;

export const actions = [
  factory.build({ event: 'adoption_completed', input: z.tuple([AdoptionCompletedEvent]), handler: noop }),
  factory.build({ event: EventName.VACCINATION_RECORDED, input: z.tuple([VaccinationRecordedEvent]), handler: noop }),
  factory.build({ event: EventName.BOOK_RESTOCKED, input: z.tuple([BookStockChanged]), handler: noop }),
  factory.build({ event: EventName.BOOK_SOLD_OUT, input: z.tuple([BookStockChanged]), handler: noop }),
];
