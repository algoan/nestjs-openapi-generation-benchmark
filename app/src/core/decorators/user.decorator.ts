import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Identifier } from '../interfaces/identifier.interface';

/**
 * Inject the caller identity decoded by the AuthGuard
 */
export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext): Identifier | undefined => {
  const request: Request & { user?: Identifier } = ctx.switchToHttp().getRequest();

  return request.user;
});
