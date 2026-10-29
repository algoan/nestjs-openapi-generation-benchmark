import { z } from 'zod';
import { Species } from '../animals/enums/species.enum';
import {
  authErrors,
  badRequest,
  conflict,
  dateTime,
  json,
  jsonBody,
  noContent,
  notFound,
  objectId,
  paginated,
  paginationQuery,
  registry,
  shelterParams,
} from '../core/openapi';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';

const Adopter = z
  .object({
    firstName: z.string().max(80),
    lastName: z.string().max(80),
    email: z.email(),
    phone: z.string().optional().describe('Phone number, in the E.164 format'),
  })
  .openapi('Adopter');

const CreateAdoptionDto = z
  .object({
    animalId: z.string(),
    species: z.enum(Species),
    adopter: Adopter,
    fee: z.number().min(0).describe('Adoption fee, in euros'),
    notes: z.string().max(500).optional(),
  })
  .openapi('CreateAdoptionDto');

const RejectAdoptionDto = z
  .object({ reason: z.string().min(10).max(500).describe('Why the request is rejected, sent to the adopter') })
  .openapi('RejectAdoptionDto');

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
  .openapi('Adoption');

const AdoptionReceipt = z
  .object({
    adoptionId: z.string(),
    status: z.enum(AdoptionRequestStatus),
    expectedDecisionDate: dateTime.describe('When the shelter commits to answer'),
  })
  .openapi('AdoptionReceipt');

const params = shelterParams.extend({ adoptionId: objectId });

registry.registerPath({
  method: 'post',
  path: '/shelters/{shelterId}/adoptions',
  summary: 'File an adoption request',
  request: {
    params: shelterParams,
    headers: z.object({ 'x-request-id': z.string().optional().describe('Correlation id, echoed in the logs') }),
    body: jsonBody(CreateAdoptionDto),
  },
  responses: { 201: json(AdoptionReceipt), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/adoptions',
  summary: 'List the adoption requests of a shelter',
  request: {
    params: shelterParams,
    query: paginationQuery.extend({
      status: z.enum(AdoptionRequestStatus).optional().describe('Only return the requests in this status'),
    }),
  },
  responses: { 200: json(paginated(Adoption)), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/adoptions/{adoptionId}',
  summary: 'Get an adoption request',
  request: { params },
  responses: { 200: json(Adoption), ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'post',
  path: '/shelters/{shelterId}/adoptions/{adoptionId}/approve',
  summary: 'Approve a pending adoption request',
  request: { params },
  responses: { 200: json(Adoption), ...authErrors, ...notFound, ...conflict },
});

registry.registerPath({
  method: 'post',
  path: '/shelters/{shelterId}/adoptions/{adoptionId}/reject',
  summary: 'Reject a pending adoption request',
  request: { params, body: jsonBody(RejectAdoptionDto) },
  responses: { 200: json(Adoption), ...badRequest, ...authErrors, ...notFound, ...conflict },
});

registry.registerPath({
  method: 'delete',
  path: '/shelters/{shelterId}/adoptions/{adoptionId}',
  summary: 'Cancel an adoption request',
  request: { params },
  responses: { 204: noContent, ...authErrors, ...notFound },
});
