import { AuthErrors, BadRequest, NotFound, PaginationQuery } from '../core/openapi';
import { PaginatedData } from '../core/pagination';
import { CreateCatDto } from './dto/create-cat.dto';
import { CreateDogDto } from './dto/create-dog.dto';
import { SearchAnimalsDto } from './dto/search-animals.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './models/cat.model';
import { Dog } from './models/dog.model';

interface ShelterParams {
  shelterId: string;
}

interface AnimalParams extends ShelterParams {
  animalId: string;
}

interface CatParams extends ShelterParams {
  catId: string;
}

interface DogParams extends ShelterParams {
  dogId: string;
}

interface SearchAnimalsQuery extends SearchAnimalsDto {
  /**
   * Include the animals already adopted
   * @default false
   */
  includeAdopted?: boolean;
}

/**
 * Search the animals of a shelter
 */
export type SearchAnimalsAPI = {
  path: '/v1/shelters/{shelterId}/animals';
  method: 'GET';
  params: ShelterParams;
  query: SearchAnimalsQuery;
  responses: { 200: (Cat | Dog)[] } & BadRequest & AuthErrors & NotFound;
};

/**
 * Get an animal, whatever its species
 */
export type FindOneAnimalAPI = {
  path: '/v1/shelters/{shelterId}/animals/{animalId}';
  method: 'GET';
  params: AnimalParams;
  responses: { 200: Cat | Dog } & AuthErrors & NotFound;
};

/**
 * Register a cat in a shelter
 * @body.required true
 */
export type CreateCatAPI = {
  path: '/v1/shelters/{shelterId}/cats';
  method: 'POST';
  params: ShelterParams;
  body: CreateCatDto;
  responses: { 201: Cat } & BadRequest & AuthErrors & NotFound;
};

/**
 * List the cats of a shelter
 */
export type FindAllCatsAPI = {
  path: '/v1/shelters/{shelterId}/cats';
  method: 'GET';
  params: ShelterParams;
  query: PaginationQuery;
  responses: { 200: PaginatedData<Cat> } & BadRequest & AuthErrors & NotFound;
};

/**
 * Get a cat
 */
export type FindOneCatAPI = {
  path: '/v1/shelters/{shelterId}/cats/{catId}';
  method: 'GET';
  params: CatParams;
  responses: { 200: Cat } & AuthErrors & NotFound;
};

/**
 * Update a cat
 * @body.required true
 */
export type UpdateCatAPI = {
  path: '/v1/shelters/{shelterId}/cats/{catId}';
  method: 'PATCH';
  params: CatParams;
  body: UpdateCatDto;
  responses: { 200: Cat } & BadRequest & AuthErrors & NotFound;
};

/**
 * Remove a cat from a shelter
 */
export type RemoveCatAPI = {
  path: '/v1/shelters/{shelterId}/cats/{catId}';
  method: 'DELETE';
  params: CatParams;
  responses: { 204: never } & AuthErrors & NotFound;
};

/**
 * Register a dog in a shelter
 * @body.required true
 */
export type CreateDogAPI = {
  path: '/v1/shelters/{shelterId}/dogs';
  method: 'POST';
  params: ShelterParams;
  body: CreateDogDto;
  responses: { 201: Dog } & BadRequest & AuthErrors & NotFound;
};

/**
 * List the dogs of a shelter
 */
export type FindAllDogsAPI = {
  path: '/v1/shelters/{shelterId}/dogs';
  method: 'GET';
  params: ShelterParams;
  query: PaginationQuery;
  responses: { 200: PaginatedData<Dog> } & BadRequest & AuthErrors & NotFound;
};

/**
 * Get a dog
 */
export type FindOneDogAPI = {
  path: '/v1/shelters/{shelterId}/dogs/{dogId}';
  method: 'GET';
  params: DogParams;
  responses: { 200: Dog } & AuthErrors & NotFound;
};
