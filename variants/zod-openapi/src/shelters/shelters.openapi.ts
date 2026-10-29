import * as z from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import { authErrors, badRequest, body, dateTime, json, noContent, notFound, objectId, paginated, PaginationQuery } from '../core/openapi';
import { ShelterStatus } from './enums/shelter-status.enum';

const Address = z
  .object({
    street: z.string().max(120),
    city: z.string(),
    postalCode: z.string(),
    complement: z.string().optional().describe('Building, floor, etc.'),
  })
  .meta({ id: 'Address', description: 'Postal address' });

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
  .meta({ id: 'CreateShelterDto', description: 'Create Shelter DTO' });

const UpdateShelterDto = CreateShelterDto.omit({ country: true })
  .partial()
  .extend({ status: z.enum(ShelterStatus).optional() })
  .meta({ id: 'UpdateShelterDto', description: 'Update Shelter DTO: every field but the country can be updated' });

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
  .meta({ id: 'Shelter', description: 'Shelter Model' });

const ShelterStats = z
  .object({
    shelterId: z.string(),
    year: z.number(),
    hostedAnimals: z.number().describe('Number of animals currently hosted'),
    adoptions: z.object({ approved: z.number(), rejected: z.number(), pending: z.number() }),
    occupancyRate: z.number().describe('Hosted animals / capacity, between 0 and 1'),
  })
  .meta({ id: 'ShelterStats', description: 'Yearly statistics of a shelter' });

const path = z.object({ id: objectId.describe('The shelter id') });

export const shelterPaths: ZodOpenApiPathsObject = {
  '/v1/shelters': {
    post: {
      summary: 'Create a shelter',
      requestBody: body(CreateShelterDto),
      responses: { 201: json(Shelter), ...badRequest, ...authErrors },
    },
    get: {
      summary: 'List the shelters the caller has access to',
      requestParams: { query: PaginationQuery },
      responses: { 200: json(paginated(Shelter)), ...badRequest, ...authErrors },
    },
  },
  '/v1/shelters/{id}': {
    get: {
      summary: 'Get a shelter by id',
      requestParams: { path },
      responses: { 200: json(Shelter), ...authErrors, ...notFound },
    },
    patch: {
      summary: 'Update a shelter',
      requestParams: { path },
      requestBody: body(UpdateShelterDto),
      responses: { 200: json(Shelter), ...badRequest, ...authErrors, ...notFound },
    },
    delete: {
      summary: 'Delete a shelter',
      requestParams: { path },
      responses: { ...noContent, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{id}/stats': {
    get: {
      summary: 'Get the yearly statistics of a shelter',
      requestParams: { path, query: z.object({ year: z.number().int().describe('The year of the statistics') }) },
      responses: { 200: json(ShelterStats), ...badRequest, ...authErrors, ...notFound },
    },
  },
};
