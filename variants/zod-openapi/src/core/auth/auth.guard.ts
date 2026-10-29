import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';
import { Identifier } from '../interfaces/identifier.interface';
import { META_UNPROTECTED } from './auth.constants';

/**
 * Global authentication guard.
 * Stands in for Keycloak: the bearer token is a base64url-encoded JSON identifier.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== 'http') {
      return true;
    }

    const isUnprotected: boolean | undefined = this.reflector.getAllAndOverride<boolean>(META_UNPROTECTED, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isUnprotected === true) {
      return true;
    }

    const request: Request & { user?: Identifier } = context.switchToHttp().getRequest();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');

    if (scheme !== 'Bearer' || token === undefined) {
      throw new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Missing bearer token',
        status: 401,
      });
    }

    try {
      request.user = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as Identifier;
    } catch {
      throw new UnauthorizedException({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Invalid bearer token',
        status: 401,
      });
    }

    return true;
  }
}
