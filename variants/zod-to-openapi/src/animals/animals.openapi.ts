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
  shelterParams,
} from '../core/openapi';
import { AdoptionStatus } from './enums/adoption-status.enum';
import { CoatPattern } from './enums/coat-pattern.enum';
import { DogSize } from './enums/dog-size.enum';
import { Sex } from './enums/sex.enum';
import { Species } from './enums/species.enum';

const Vaccination = z
  .object({ name: z.string().describe('Vaccine name'), date: dateTime, expiresAt: dateTime.optional() })
  .openapi('Vaccination');

const CreateAnimalDto = z.object({
  name: z.string().max(50),
  birthDate: dateTime.optional(),
  sex: z.enum(Sex),
  vaccinations: z.array(Vaccination).optional(),
  weightKg: z.number().min(0).optional().describe('Weight in kilograms'),
});

const CreateCatDto = CreateAnimalDto.extend({
  indoor: z.boolean().describe('Whether the cat must live indoors'),
  coatPattern: z.enum(CoatPattern).optional(),
}).openapi('CreateCatDto');

const UpdateCatDto = CreateCatDto.partial()
  .extend({ status: z.enum(AdoptionStatus).optional() })
  .openapi('UpdateCatDto');

const CreateDogDto = CreateAnimalDto.extend({
  breed: z.string(),
  size: z.enum(DogSize),
  goodWithKids: z.boolean().optional(),
}).openapi('CreateDogDto');

const Animal = z.object({
  _id: objectId,
  shelterId: objectId,
  name: z.string(),
  birthDate: dateTime.optional(),
  sex: z.enum(Sex),
  status: z.enum(AdoptionStatus),
  vaccinations: z.array(Vaccination),
  weightKg: z.number().optional().describe('Weight in kilograms'),
  createdAt: dateTime.describe('Value added by mongoose'),
  updatedAt: dateTime.describe('Value added by mongoose'),
});

const Cat = Animal.extend({
  species: z.literal(Species.CAT),
  indoor: z.boolean().describe('Whether the cat must live indoors'),
  coatPattern: z.enum(CoatPattern).optional(),
}).openapi('Cat');

const Dog = Animal.extend({
  species: z.literal(Species.DOG),
  breed: z.string(),
  size: z.enum(DogSize),
  goodWithKids: z.boolean().optional(),
}).openapi('Dog');

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/animals',
  summary: 'Search the animals of a shelter',
  request: {
    params: shelterParams,
    query: z.object({
      species: z.enum(Species).optional(),
      status: z.enum(AdoptionStatus).optional(),
      name: z.string().max(50).optional().describe('Case-insensitive prefix of the animal name'),
      minAge: z.number().int().min(0).optional().describe('Minimum age, in years'),
      includeAdopted: z.boolean().default(false).describe('Include the animals already adopted'),
    }),
  },
  responses: { 200: json(z.array(z.union([Cat, Dog]))), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/animals/{animalId}',
  summary: 'Get an animal, whatever its species',
  request: { params: shelterParams.extend({ animalId: objectId }) },
  responses: { 200: json(z.union([Cat, Dog])), ...authErrors, ...notFound },
});

const catParams = shelterParams.extend({ catId: objectId });

registry.registerPath({
  method: 'post',
  path: '/shelters/{shelterId}/cats',
  summary: 'Register a cat in a shelter',
  request: { params: shelterParams, body: jsonBody(CreateCatDto) },
  responses: { 201: json(Cat), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/cats',
  summary: 'List the cats of a shelter',
  request: { params: shelterParams, query: paginationQuery },
  responses: { 200: json(paginated(Cat)), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/cats/{catId}',
  summary: 'Get a cat',
  request: { params: catParams },
  responses: { 200: json(Cat), ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'patch',
  path: '/shelters/{shelterId}/cats/{catId}',
  summary: 'Update a cat',
  request: { params: catParams, body: jsonBody(UpdateCatDto) },
  responses: { 200: json(Cat), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'delete',
  path: '/shelters/{shelterId}/cats/{catId}',
  summary: 'Remove a cat from a shelter',
  request: { params: catParams },
  responses: { 204: noContent, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'post',
  path: '/shelters/{shelterId}/dogs',
  summary: 'Register a dog in a shelter',
  request: { params: shelterParams, body: jsonBody(CreateDogDto) },
  responses: { 201: json(Dog), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/dogs',
  summary: 'List the dogs of a shelter',
  request: { params: shelterParams, query: paginationQuery },
  responses: { 200: json(paginated(Dog)), ...badRequest, ...authErrors, ...notFound },
});

registry.registerPath({
  method: 'get',
  path: '/shelters/{shelterId}/dogs/{dogId}',
  summary: 'Get a dog',
  request: { params: shelterParams.extend({ dogId: objectId }) },
  responses: { 200: json(Dog), ...authErrors, ...notFound },
});
