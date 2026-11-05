import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { LogOptions, META_LOG } from './log.decorator';

/**
 * Global interceptor logging routes decorated with `@Log()`. It never changes the payload.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(LoggingInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options: LogOptions | undefined = this.reflector.get<LogOptions>(META_LOG, context.getHandler());
    if (options === undefined) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((): void => {
        this.logger.debug(`${context.getClass().name}.${context.getHandler().name} (masked: ${options.mask?.join(',')})`);
      }),
    );
  }
}
