import { Global, Module } from '@nestjs/common';
import { PubSubClient } from './pubsub.client';
import { PUBSUB_CLIENT } from './pubsub.constants';

/**
 * Pub/Sub Module
 */
@Global()
@Module({
  providers: [{ provide: PUBSUB_CLIENT, useClass: PubSubClient }],
  exports: [PUBSUB_CLIENT],
})
export class PubSubModule {}
