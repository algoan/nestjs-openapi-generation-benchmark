import * as z from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import { json } from './core/openapi';

const HealthStatus = z
  .object({ status: z.literal('ok'), uptime: z.number().describe('Process uptime, in seconds') })
  .meta({ id: 'HealthStatus', description: 'Health check response' });

export const appPaths: ZodOpenApiPathsObject = {
  '/v1/health': {
    get: { summary: 'Health check', security: [], responses: { 200: json(HealthStatus) } },
  },
};
