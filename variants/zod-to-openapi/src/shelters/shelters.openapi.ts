import { z } from 'zod';
import {
  authErrors,
  badRequest,
  dateTime,
  json,
  jsonBody,
  noContent,
  notFound,
  objectId,
  paginated,
  paginationQuery,
  registry,
} from '../core/openapi';
import { ShelterStatus } from './enums/shelter-status.enum';

const Address = z
  .object({
    street: z.string().max(120),
    city: z.string(),
    postalCode: z.string(),
    complement: z.string().optional().describe('Building, floor, etc.'),
  })
  .openapi('Address');

const CreateShelterDto = z
  .object({
    name: z.string().max(100).describe('Display name of the shelter'),
    country: z.string().describe('ISO 3166-1 alpha-2 country code'),
    address: Address.optional(),
    email: z.email().optional().describe('Contact email'),
    capacity: z.number().int().min(0).max(1000).describe('Maximum number of animals the shelter can host'),
    tags: z.array(z.string()).max(10).optional(),
    metadata: z.record(z.string(), z.unknown()).optional().describe('Free-form data attached by the caller'),
  })
  .openapi('CreateShelterDto');

const UpdateShelterDto = CreateShelterDto.omit({ country: true })
  .partial()
  .extend({ status: z.enum(ShelterStatus).optional() })
  .openapi('UpdateShelterDto');

const Shelter = z
  .object({
    _id: objectId,
    name: z.string().describe('Display name of the shelter'),
    country: z.string().describe('ISO 3166-1 alpha-2 country code'),
    address: Address.optional(),
    email: z.string().optional().describe('Contact email'),
    capacity: z.number().describe('Maximum number of animals the shelter can host'),
    status: z.enum(ShelterStatus),
    tags: z.array(z.string()),
    metadata: z.record(z.string(), z.unknown()).optional().describe('Free-form data attached by the caller'),
    createdAt: dateTime.describe('Value added by mongoose'),
    updatedAt: dateTime.describe('Value added by mongoose'),
  })
  .openapi('Shelter');

const ShelterStats = z
  .object({
    shelterId: z.string(),
    year: z.number(),
    hostedAnimals: z.number().describe('Number of animals currently hosted'),
    adoptions: z.object({ approved: z.number(), rejected: z.number(), pending: z.number() }),
    occupancyRate: z.number().describe('Hosted animals / capacity, between 0 and 1'),
  })
  .openapi('ShelterStats');

const params = z.object({ id: objectId.describe('The shelter id') });

registry.registerPath({
  method: 'post',
  path: '/shelters',
  summary: 'Create a shelter',
  request: { body: jsonBody(CreateShelterDto) },
  responses: { 201: json(Shelter), ...badRequest, ...authErrors },
});

registry.registerPath({
  method: 'get',
  path: '/shelters',
  summary: 'List the shelters the caller has access to',
  request: { query: paginationQuery },
  responses: { 200: json(paginated(Shelter)), ...badRequest, ...authErrors },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{id}',
  summary: 'Get a shelter by id',
  request: { params },
  responses: { 200: json(Shelter), ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'patch',
  path: '/shelters/{id}',
  summary: 'Update a shelter',
  request: { params, body: jsonBody(UpdateShelterDto) },
  responses: { 200: json(Shelter), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'delete',
  path: '/shelters/{id}',
  summary: 'Delete a shelter',
  request: { params },
  responses: { 204: noContent, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{id}/stats',
  summary: 'Get the yearly statistics of a shelter',
  request: { params, query: z.object({ year: z.number().int().describe('The year of the statistics') }) },
  responses: { 200: json(ShelterStats), ...badRequest, ...authErrors, ...notFound },
});
