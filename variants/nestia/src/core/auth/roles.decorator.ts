import { SetMetadata } from '@nestjs/common';
import { ApiErrors } from '../swagger/api-errors.decorator';
import { META_ROLES } from './auth.constants';

/**
 * Options of the Roles decorator (same shape as nest-keycloak-connect)
 */
export interface RoleDecoratorOptions {
  roles: string[];
}

/**
 * Restrict a route to callers having at least one of the given roles
 * (and document it: bearer security, read by `nestia swagger` like `@ApiBearerAuth()`, and 401/403 errors)
 */
export const Roles =
  (options: RoleDecoratorOptions): MethodDecorator & ClassDecorator =>
  (target: object, key?: string | symbol, descriptor?: PropertyDescriptor): void => {
    SetMetadata(META_ROLES, options)(target, key as string, descriptor as PropertyDescriptor);
    SetMetadata('swagger/apiSecurity', [{ bearer: [] }])(target, key as string, descriptor as PropertyDescriptor);
    const prototype: object = descriptor ? target : (target as { prototype: object }).prototype;
    for (const [name, method] of Object.entries(descriptor ? { [key as string]: descriptor } : Object.getOwnPropertyDescriptors(prototype))) {
      if (name !== 'constructor') ApiErrors(401, 403)(prototype, name, method);
    }
  };
