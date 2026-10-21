import { NoSecurity, Route } from 'tsoa';
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
@Route('')
export class AppController {
  /**
   * Health check
   */
  @Get('health')
  @Unprotected()
  @NoSecurity()
  public getHealth(): HealthStatus {
    return { status: 'ok', uptime: process.uptime() };
  }
}
