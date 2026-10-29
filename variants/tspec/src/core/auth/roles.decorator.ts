import { SetMetadata } from '@nestjs/common';
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
  SetMetadata(META_ROLES, options);
