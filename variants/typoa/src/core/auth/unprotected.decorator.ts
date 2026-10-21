import { SetMetadata } from '@nestjs/common';
import { META_UNPROTECTED } from './auth.constants';

/**
 * Allow a route to be called without any bearer token
 */
export const Unprotected = (): MethodDecorator & ClassDecorator => SetMetadata(META_UNPROTECTED, true);
