import * as z from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import { Species } from '../animals/enums/species.enum';
import {
  authErrors,
  badRequest,
  body,
  conflict,
  dateTime,
  json,
  noContent,
  notFound,
  objectId,
  paginated,
  PaginationQuery,
} from '../core/openapi';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';

const Adopter = z
  .object({
    firstName: z.string().max(80),
    lastName: z.string().max(80),
    email: z.email(),
    phone: z.string().optional().describe('Phone number, in the E.164 format'),
  })
  .meta({ id: 'Adopter', description: 'Person adopting an animal' });

const CreateAdoptionDto = z
  .object({
    animalId: objectId,
    species: z.enum(Species),
    adopter: Adopter,
    fee: z.number().min(0).describe('Adoption fee, in euros'),
    notes: z.string().max(500).optional(),
  })
  .meta({ id: 'CreateAdoptionDto', description: 'Create Adoption DTO' });

const RejectAdoptionDto = z
  .object({ reason: z.string().min(10).max(500).describe('Why the request is rejected, sent to the adopter') })
  .meta({ id: 'RejectAdoptionDto', description: 'Reject Adoption DTO' });

const Adoption = z
  .object({
    _id: objectId,
    shelterId: objectId,
    animalId: objectId,
    species: z.enum(Species),
    adopter: Adopter,
    status: z.enum(AdoptionRequestStatus),
    fee: z.number().describe('Adoption fee, in euros'),
    notes: z.string().optional(),
    rejectionReason: z.string().optional().describe('Why the request was rejected'),
    decidedAt: dateTime.optional().describe('When the request was approved or rejected'),
    createdAt: dateTime.describe('Value added by mongoose'),
    updatedAt: dateTime.describe('Value added by mongoose'),
  })
  .meta({ id: 'Adoption', description: 'Adoption Model' });

const AdoptionReceipt = z
  .object({
    adoptionId: z.string(),
    status: z.enum(AdoptionRequestStatus),
    expectedDecisionDate: dateTime.describe('When the shelter commits to answer'),
  })
  .meta({ id: 'AdoptionReceipt', description: 'Receipt returned when an adoption request is filed' });

const shelter = z.object({ shelterId: objectId });
const adoption = shelter.extend({ adoptionId: objectId });

export const adoptionPaths: ZodOpenApiPathsObject = {
  '/v1/shelters/{shelterId}/adoptions': {
    post: {
      summary: 'File an adoption request',
      requestParams: {
        path: shelter,
        header: z.object({ 'x-request-id': z.string().optional().describe('Correlation id, echoed in the logs') }),
      },
      requestBody: body(CreateAdoptionDto),
      responses: { 201: json(AdoptionReceipt), ...badRequest, ...authErrors, ...notFound },
    },
    get: {
      summary: 'List the adoption requests of a shelter',
      requestParams: {
        path: shelter,
        query: PaginationQuery.extend({
          status: z.enum(AdoptionRequestStatus).optional().describe('Only return the requests in this status'),
        }),
      },
      responses: { 200: json(paginated(Adoption)), ...badRequest, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/adoptions/{adoptionId}': {
    get: {
      summary: 'Get an adoption request',
      requestParams: { path: adoption },
      responses: { 200: json(Adoption), ...authErrors, ...notFound },
    },
    delete: {
      summary: 'Cancel an adoption request',
      requestParams: { path: adoption },
      responses: { ...noContent, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/adoptions/{adoptionId}/approve': {
    post: {
      summary: 'Approve a pending adoption request',
      requestParams: { path: adoption },
      responses: { 200: json(Adoption), ...authErrors, ...notFound, ...conflict },
    },
  },
  '/v1/shelters/{shelterId}/adoptions/{adoptionId}/reject': {
    post: {
      summary: 'Reject a pending adoption request',
      requestParams: { path: adoption },
      requestBody: body(RejectAdoptionDto),
      responses: { 200: json(Adoption), ...badRequest, ...authErrors, ...notFound, ...conflict },
    },
  },
};
