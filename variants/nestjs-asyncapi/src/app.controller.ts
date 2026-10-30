import { Controller, Get } from '@nestjs/common';
import { Unprotected } from './core/auth/unprotected.decorator';

/**
 * Health check response
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
   */
  @Get('health')
  @Unprotected()
  public getHealth(): HealthStatus {
    return { status: 'ok', uptime: process.uptime() };
  }
}
