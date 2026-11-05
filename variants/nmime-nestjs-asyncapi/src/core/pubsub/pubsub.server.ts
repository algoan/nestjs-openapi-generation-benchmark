import { CustomTransportStrategy, Server } from '@nestjs/microservices';

/**
 * Pub/Sub server, dispatching the subscribed events to the `@EventPattern` handlers.
 * Stands in for the Google Pub/Sub server: it does not pull any subscription.
 */
export class PubSubServer extends Server implements CustomTransportStrategy {
  public listen(callback: () => void): void {
    callback();
  }

  public close(): void {
    return undefined;
  }

  public on(): void {
    return undefined;
  }

  public unwrap<T>(): T {
    throw new Error('The Pub/Sub server has no underlying instance');
  }
}
