import * as z from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import {
  authErrors,
  badRequest,
  body,
  dateTime,
  json,
  noContent,
  notFound,
  objectId,
  paginated,
  PaginationQuery,
} from '../core/openapi';
import { AdoptionStatus } from './enums/adoption-status.enum';
import { CoatPattern } from './enums/coat-pattern.enum';
import { DogSize } from './enums/dog-size.enum';
import { Sex } from './enums/sex.enum';
import { Species } from './enums/species.enum';

const Vaccination = z
  .object({ name: z.string().describe('Vaccine name'), date: dateTime, expiresAt: dateTime.optional() })
  .meta({ id: 'Vaccination', description: 'A vaccine injection' });

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
}).meta({ id: 'CreateCatDto', description: 'Create Cat DTO' });

const CreateDogDto = CreateAnimalDto.extend({
  breed: z.string(),
  size: z.enum(DogSize),
  goodWithKids: z.boolean().optional(),
}).meta({ id: 'CreateDogDto', description: 'Create Dog DTO' });

const UpdateCatDto = CreateCatDto.partial()
  .extend({ status: z.enum(AdoptionStatus).optional() })
  .meta({ id: 'UpdateCatDto', description: 'Update Cat DTO' });

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
}).meta({ id: 'Cat', description: 'Cat Model' });

const Dog = Animal.extend({
  species: z.literal(Species.DOG),
  breed: z.string(),
  size: z.enum(DogSize),
  goodWithKids: z.boolean().optional(),
}).meta({ id: 'Dog', description: 'Dog Model' });

const SearchAnimalsQuery = z.object({
  species: z.enum(Species).optional(),
  status: z.enum(AdoptionStatus).optional(),
  name: z.string().max(50).optional().describe('Case-insensitive prefix of the animal name'),
  minAge: z.number().int().min(0).optional().describe('Minimum age, in years'),
  includeAdopted: z.boolean().default(false).describe('Include the animals already adopted'),
});

const shelter = z.object({ shelterId: objectId });
const cat = shelter.extend({ catId: objectId });
const dog = shelter.extend({ dogId: objectId });

export const animalPaths: ZodOpenApiPathsObject = {
  '/v1/shelters/{shelterId}/animals': {
    get: {
      summary: 'Search the animals of a shelter',
      requestParams: { path: shelter, query: SearchAnimalsQuery },
      responses: { 200: json(z.array(z.union([Cat, Dog]))), ...badRequest, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/animals/{animalId}': {
    get: {
      summary: 'Get an animal, whatever its species',
      requestParams: { path: shelter.extend({ animalId: objectId }) },
      responses: { 200: json(z.union([Cat, Dog])), ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/cats': {
    post: {
      summary: 'Register a cat in a shelter',
      requestParams: { path: shelter },
      requestBody: body(CreateCatDto),
      responses: { 201: json(Cat), ...badRequest, ...authErrors, ...notFound },
    },
    get: {
      summary: 'List the cats of a shelter',
      requestParams: { path: shelter, query: PaginationQuery },
      responses: { 200: json(paginated(Cat)), ...badRequest, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/cats/{catId}': {
    get: {
      summary: 'Get a cat',
      requestParams: { path: cat },
      responses: { 200: json(Cat), ...authErrors, ...notFound },
    },
    patch: {
      summary: 'Update a cat',
      requestParams: { path: cat },
      requestBody: body(UpdateCatDto),
      responses: { 200: json(Cat), ...badRequest, ...authErrors, ...notFound },
    },
    delete: {
      summary: 'Remove a cat from a shelter',
      requestParams: { path: cat },
      responses: { ...noContent, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/dogs': {
    post: {
      summary: 'Register a dog in a shelter',
      requestParams: { path: shelter },
      requestBody: body(CreateDogDto),
      responses: { 201: json(Dog), ...badRequest, ...authErrors, ...notFound },
    },
    get: {
      summary: 'List the dogs of a shelter',
      requestParams: { path: shelter, query: PaginationQuery },
      responses: { 200: json(paginated(Dog)), ...badRequest, ...authErrors, ...notFound },
    },
  },
  '/v1/shelters/{shelterId}/dogs/{dogId}': {
    get: {
      summary: 'Get a dog',
      requestParams: { path: dog },
      responses: { 200: json(Dog), ...authErrors, ...notFound },
    },
  },
};
