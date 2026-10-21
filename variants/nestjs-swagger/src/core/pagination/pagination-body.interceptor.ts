import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { DEFAULT_LIMIT, DEFAULT_PAGE_NAME, DEFAULT_PER_PAGE_NAME } from './pagination-param.decorator';
import { DataToPaginate, PaginatedData, PaginationOptions } from './pagination.interfaces';

/**
 * Turn the `DataToPaginate` returned by a handler into a `PaginatedData` body
 * (same behaviour as `@algoan/nestjs-pagination`)
 */
@Injectable()
export class PaginationBodyInterceptor<T> implements NestInterceptor<DataToPaginate<T>, PaginatedData<T>> {
  private readonly pageName: string;
  private readonly perPageName: string;
  private readonly defaultLimit: number;

  constructor(options: PaginationOptions = {}) {
    this.pageName = options.pageName ?? DEFAULT_PAGE_NAME;
    this.perPageName = options.perPageName ?? DEFAULT_PER_PAGE_NAME;
    this.defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  }

  public intercept(context: ExecutionContext, next: CallHandler<DataToPaginate<T>>): Observable<PaginatedData<T>> {
    const request: Request = context.switchToHttp().getRequest();
    const page: number = Math.max(Number(request.query[this.pageName] ?? 1), 1);
    const limit: number = Number(request.query[this.perPageName] ?? this.defaultLimit);

    return next.handle().pipe(
      map((data: DataToPaginate<T>): PaginatedData<T> => {
        const totalPages: number = Math.max(Math.ceil(data.totalResources / limit), 1);
        const link = (target: number): string => this.buildUrl(request, target, limit);

        return {
          resources: data.resources,
          pagination: {
            next: page < totalPages ? link(page + 1) : null,
            previous: page > 1 ? link(page - 1) : null,
            first: link(1),
            last: link(totalPages),
            totalPages,
            totalResources: data.totalResources,
          },
        };
      }),
    );
  }

  private buildUrl(request: Request, page: number, limit: number): string {
    const params: URLSearchParams = new URLSearchParams(request.query as Record<string, string>);
    params.set(this.pageName, String(page));
    params.set(this.perPageName, String(limit));

    return `${request.path}?${params.toString()}`;
  }
}
