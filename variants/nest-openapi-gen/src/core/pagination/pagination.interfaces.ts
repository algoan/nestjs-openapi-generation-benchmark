/**
 * What a service returns for a paginated route, before the PaginationBodyInterceptor
 */
export interface DataToPaginate<T> {
  resources: T[];
  totalResources: number;
}

/**
 * Pagination links of a paginated response
 */
export interface PaginationLinks {
  next: string | null;
  previous: string | null;
  first: string | null;
  last: string | null;
  totalPages: number | null;
  totalResources: number | null;
}

/**
 * Body of a paginated response, built by the PaginationBodyInterceptor
 */
export interface PaginatedData<T> {
  resources: T[];
  pagination: PaginationLinks;
}

/**
 * Mongo query built from the pagination query parameters
 */
export interface MongoPagination {
  filter: Record<string, unknown>;
  limit: number;
  skip: number;
  sort?: Record<string, 1 | -1>;
}

/**
 * Options shared by the pagination decorator and interceptor
 */
export interface PaginationOptions {
  pageName?: string;
  perPageName?: string;
  defaultLimit?: number;
}

/**
 * Query parameters read by the PaginationParams decorator (documentation only)
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}
