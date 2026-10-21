import { SetMetadata } from '@nestjs/common';

export const META_LOG: string = 'log';

/**
 * Log options: list of body paths to mask in the logs
 */
export interface LogOptions {
  mask?: string[];
}

/**
 * Log the request and the response of a route (see LoggingInterceptor)
 */
export const Log = (options: LogOptions = {}): MethodDecorator => SetMetadata(META_LOG, options);
