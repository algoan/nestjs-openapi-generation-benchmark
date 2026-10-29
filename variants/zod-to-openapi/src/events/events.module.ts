import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';

/**
 * Events Module
 */
@Module({
  controllers: [EventsController],
})
export class EventsModule {}
