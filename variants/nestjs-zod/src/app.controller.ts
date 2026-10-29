import { Controller, Get } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Unprotected } from './core/auth/unprotected.decorator';

/**
 * Health check response
 */
export class HealthStatus {
  @ApiProperty({ enum: ['ok'] })
  status: 'ok';
  /**
   * Process uptime, in seconds
   */
  @ApiProperty({ description: 'Process uptime, in seconds' })
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
