import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';
import { MongoPagination, PaginationOptions } from './pagination.interfaces';

export const DEFAULT_PAGE_NAME: string = 'page';
export const DEFAULT_PER_PAGE_NAME: string = 'per_page';
export const DEFAULT_LIMIT: number = 10;

const parseJson = (value: unknown, name: string): Record<string, unknown> | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    throw new BadRequestException({ code: ErrorCodes.BAD_REQUEST, message: `Invalid ${name}`, status: 400 });
  }
};

/**
 * Build a Mongo query from the `page`, `<perPageName>`, `filter` and `sort` query parameters
 * (same behaviour as `@algoan/nestjs-pagination`)
 */
export const getMongoQuery = (options: PaginationOptions | undefined, ctx: ExecutionContext): MongoPagination => {
  const query: Request['query'] = ctx.switchToHttp().getRequest<Request>().query;
  const page: number = Math.max(Number(query[options?.pageName ?? DEFAULT_PAGE_NAME] ?? 1), 1);
  const limit: number = Number(query[options?.perPageName ?? DEFAULT_PER_PAGE_NAME] ?? options?.defaultLimit ?? DEFAULT_LIMIT);

  return {
    filter: parseJson(query.filter, 'filter') ?? {},
    sort: parseJson(query.sort, 'sort') as MongoPagination['sort'],
    limit,
    skip: (page - 1) * limit,
  };
};

/**
 * Inject a MongoPagination built from the query parameters
 */
export const PaginationParams = createParamDecorator(getMongoQuery);
