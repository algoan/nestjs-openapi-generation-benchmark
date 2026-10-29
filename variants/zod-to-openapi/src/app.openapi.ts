import { z } from 'zod';
import { json, registry, unprotected } from './core/openapi';

registry.registerPath({
  method: 'get',
  path: '/health',
  summary: 'Health check',
  security: unprotected,
  responses: {
    200: json(z.object({ status: z.literal('ok'), uptime: z.number().describe('Process uptime, in seconds') }).openapi('HealthStatus')),
  },
});
