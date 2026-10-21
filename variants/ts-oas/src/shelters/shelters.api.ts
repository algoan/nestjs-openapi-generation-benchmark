import { AuthErrors, BadRequest, NotFound, PaginationQuery } from '../core/openapi';
import { PaginatedData } from '../core/pagination';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterStats } from './interfaces/shelter-stats.interface';
import { Shelter } from './models/shelter.model';

interface ShelterParams {
  /** The shelter id */
  id: string;
}

/**
 * Create a shelter
 * @body.required true
 */
export type CreateShelterAPI = {
  path: '/v1/shelters';
  method: 'POST';
  body: CreateShelterDto;
  responses: { 201: Shelter } & BadRequest & AuthErrors;
};

/**
 * List the shelters the caller has access to
 */
export type FindAllSheltersAPI = {
  path: '/v1/shelters';
  method: 'GET';
  query: PaginationQuery;
  responses: { 200: PaginatedData<Shelter> } & BadRequest & AuthErrors;
};

/**
 * Get a shelter by id
 */
export type FindOneShelterAPI = {
  path: '/v1/shelters/{id}';
  method: 'GET';
  params: ShelterParams;
  responses: { 200: Shelter } & AuthErrors & NotFound;
};

/**
 * Update a shelter
 * @body.required true
 */
export type UpdateShelterAPI = {
  path: '/v1/shelters/{id}';
  method: 'PATCH';
  params: ShelterParams;
  body: UpdateShelterDto;
  responses: { 200: Shelter } & BadRequest & AuthErrors & NotFound;
};

/**
 * Delete a shelter
 */
export type RemoveShelterAPI = {
  path: '/v1/shelters/{id}';
  method: 'DELETE';
  params: ShelterParams;
  responses: { 204: never } & AuthErrors & NotFound;
};

/**
 * Get the yearly statistics of a shelter
 */
export type GetShelterStatsAPI = {
  path: '/v1/shelters/{id}/stats';
  method: 'GET';
  params: ShelterParams;
  query: {
    /**
     * The year of the statistics
     * @type integer
     */
    year: number;
  };
  responses: { 200: ShelterStats } & BadRequest & AuthErrors & NotFound;
};
