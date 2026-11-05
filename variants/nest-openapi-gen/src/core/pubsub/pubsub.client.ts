import { Logger } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

/**
 * Pub/Sub client.
 * Stands in for the Google Pub/Sub client: events are logged instead of being published.
 */
export class PubSubClient extends ClientProxy {
  private readonly logger: Logger = new Logger(PubSubClient.name);

  public async connect(): Promise<void> {
    return Promise.resolve();
  }

  public async close(): Promise<void> {
    return Promise.resolve();
  }

  public unwrap<T>(): T {
    throw new Error('The Pub/Sub client has no underlying instance');
  }

  protected publish(_packet: ReadPacket, callback: (packet: WritePacket) => void): () => void {
    callback({ err: new Error('Pub/Sub does not support request-response'), isDisposed: true });

    return (): void => undefined;
  }

  protected async dispatchEvent<T>(packet: ReadPacket): Promise<T> {
    this.logger.debug(`Publishing ${String(packet.pattern)}: ${JSON.stringify(packet.data)}`);

    return undefined as T;
  }
}
