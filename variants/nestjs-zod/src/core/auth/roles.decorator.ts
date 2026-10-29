import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpError } from '../interfaces/http-error.interface';
import { META_ROLES } from './auth.constants';

/**
 * Options of the Roles decorator (same shape as nest-keycloak-connect)
 */
export interface RoleDecoratorOptions {
  roles: string[];
}

/**
 * Restrict a route to callers having at least one of the given roles
 */
export const Roles = (options: RoleDecoratorOptions): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SetMetadata(META_ROLES, options),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ type: HttpError }),
    ApiForbiddenResponse({ type: HttpError }),
  );
