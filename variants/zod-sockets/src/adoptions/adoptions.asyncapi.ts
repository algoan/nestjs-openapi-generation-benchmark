import * as z from 'zod';
import { Species } from '../animals/enums/species.enum';
import { EventName } from '../events/enums/event-name.enum';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';

const Adopter = z
  .object({
    firstName: z.string().max(80),
    lastName: z.string().max(80),
    email: z.email(),
    phone: z.string().optional().describe('Phone number, in the E.164 format'),
  })
  .describe('Person adopting an animal');

const AdoptionRequestedEvent = z
  .object({
    adoptionId: z.string(),
    shelterId: z.string(),
    animalId: z.string(),
    species: z.enum(Species),
    adopter: Adopter,
    fee: z.number().describe('Adoption fee, in euros'),
  })
  .describe('Payload of the `adoption_requested` Pub/Sub event');

const AdoptionDecidedEvent = z
  .object({
    adoptionId: z.string(),
    shelterId: z.string(),
    status: z.enum(AdoptionRequestStatus),
    rejectionReason: z.string().optional().describe('Why the request was rejected'),
    decidedAt: z.iso.datetime(),
  })
  .describe('Payload of the `adoption_decided` Pub/Sub event');

export const adoptionEmission = {
  [EventName.ADOPTION_REQUESTED]: { schema: z.tuple([AdoptionRequestedEvent]) },
  [EventName.ADOPTION_DECIDED]: { schema: z.tuple([AdoptionDecidedEvent]) },
};
