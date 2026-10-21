import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ErrorCodes } from '../enums/error-codes.enum';
import { Identifier } from '../interfaces/identifier.interface';
import { META_ROLES } from './auth.constants';
import { RoleDecoratorOptions } from './roles.decorator';

/**
 * Global role guard, checking the roles set by the Roles decorator
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const options: RoleDecoratorOptions | undefined = this.reflector.getAllAndOverride<RoleDecoratorOptions>(
      META_ROLES,
      [context.getHandler(), context.getClass()],
    );
    if (options === undefined || context.getType() !== 'http') {
      return true;
    }

    const request: Request & { user?: Identifier } = context.switchToHttp().getRequest();
    const roles: string[] = request.user?.roles ?? [];

    if (!options.roles.some((role: string): boolean => roles.includes(role))) {
      throw new ForbiddenException({
        code: ErrorCodes.FORBIDDEN,
        message: 'Missing role',
        status: 403,
      });
    }

    return true;
  }
}
