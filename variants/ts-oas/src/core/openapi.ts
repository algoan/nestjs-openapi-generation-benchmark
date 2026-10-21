import { HttpError } from './interfaces/http-error.interface';

/**
 * ts-oas building blocks shared by the `*.api.ts` definition files
 */

/** Query parameters read by `@PaginationParams({ perPageName: 'limit' })` */
export interface PaginationQuery {
  /**
   * Page number, starting at 1
   * @type integer
   * @default 1
   */
  page?: number;
  /**
   * Number of resources per page
   * @type integer
   * @default 10
   */
  limit?: number;
  /**
   * JSON-encoded Mongo filter
   */
  filter?: string;
  /**
   * JSON-encoded Mongo sort, e.g. `{"name":1}`
   */
  sort?: string;
}

/** Errors of every protected route (AuthGuard + RoleGuard) */
export interface AuthErrors {
  /** Missing or invalid bearer token */
  401: HttpError;
  /** Missing role or shelter access */
  403: HttpError;
}

export interface BadRequest {
  /** Invalid request */
  400: HttpError;
}

export interface NotFound {
  /** Unknown entity */
  404: HttpError;
}

export interface Conflict {
  /** Conflict with the current state of the resource */
  409: HttpError;
}

/** Public route: no bearer token needed */
export type Public = [];
