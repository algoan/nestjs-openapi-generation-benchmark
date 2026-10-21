import { AuthErrors, BadRequest, Conflict, NotFound, PaginationQuery } from '../core/openapi';
import { PaginatedData } from '../core/pagination';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { RejectAdoptionDto } from './dto/reject-adoption.dto';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionReceipt } from './interfaces/adoption-receipt.interface';
import { Adoption } from './models/adoption.model';

interface ShelterParams {
  shelterId: string;
}

interface AdoptionParams extends ShelterParams {
  adoptionId: string;
}

interface FindAllAdoptionsQuery extends PaginationQuery {
  /** Only return the requests in this status */
  status?: AdoptionRequestStatus;
}

/**
 * File an adoption request
 * @body.required true
 */
export type CreateAdoptionAPI = {
  path: '/v1/shelters/{shelterId}/adoptions';
  method: 'POST';
  params: ShelterParams;
  body: CreateAdoptionDto;
  responses: { 201: AdoptionReceipt } & BadRequest & AuthErrors & NotFound;
};

/**
 * List the adoption requests of a shelter
 */
export type FindAllAdoptionsAPI = {
  path: '/v1/shelters/{shelterId}/adoptions';
  method: 'GET';
  params: ShelterParams;
  query: FindAllAdoptionsQuery;
  responses: { 200: PaginatedData<Adoption> } & BadRequest & AuthErrors & NotFound;
};

/**
 * Get an adoption request
 */
export type FindOneAdoptionAPI = {
  path: '/v1/shelters/{shelterId}/adoptions/{adoptionId}';
  method: 'GET';
  params: AdoptionParams;
  responses: { 200: Adoption } & AuthErrors & NotFound;
};

/**
 * Approve a pending adoption request
 */
export type ApproveAdoptionAPI = {
  path: '/v1/shelters/{shelterId}/adoptions/{adoptionId}/approve';
  method: 'POST';
  params: AdoptionParams;
  responses: { 200: Adoption } & AuthErrors & NotFound & Conflict;
};

/**
 * Reject a pending adoption request
 * @body.required true
 */
export type RejectAdoptionAPI = {
  path: '/v1/shelters/{shelterId}/adoptions/{adoptionId}/reject';
  method: 'POST';
  params: AdoptionParams;
  body: RejectAdoptionDto;
  responses: { 200: Adoption } & BadRequest & AuthErrors & NotFound & Conflict;
};

/**
 * Cancel an adoption request
 */
export type RemoveAdoptionAPI = {
  path: '/v1/shelters/{shelterId}/adoptions/{adoptionId}';
  method: 'DELETE';
  params: AdoptionParams;
  responses: { 204: never } & AuthErrors & NotFound;
};
