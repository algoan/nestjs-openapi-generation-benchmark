import { HealthStatus } from './app.controller';
import { Public } from './core/openapi';

/**
 * Health check
 */
export type GetHealthAPI = {
  path: '/v1/health';
  method: 'GET';
  responses: { 200: HealthStatus };
  security: Public;
};
