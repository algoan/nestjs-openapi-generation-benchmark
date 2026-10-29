import { Controller, Get } from '@nestjs/common';
import { Unprotected } from './core/auth/unprotected.decorator';

/**
 * Health check response
 * @openapi
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       required: [status, uptime]
 *       properties:
 *         status:
 *           type: string
 *           enum: [ok]
 *         uptime:
 *           type: number
 *           description: Process uptime, in seconds
 */
export interface HealthStatus {
  status: 'ok';
  /**
   * Process uptime, in seconds
   */
  uptime: number;
}

/**
 * App Controller
 */
@Controller()
export class AppController {
  /**
   * Health check
   * @openapi
   * /health:
   *   get:
   *     summary: Health check
   *     security: []
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthStatus'
   */
  @Get('health')
  @Unprotected()
  public getHealth(): HealthStatus {
    return { status: 'ok', uptime: process.uptime() };
  }
}
