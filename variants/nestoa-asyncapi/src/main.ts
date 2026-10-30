import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PubSubServer } from './core/pubsub/pubsub.server';
import { setupApp } from './setup';

const logger: Logger = new Logger('Bootstrap');
const DEFAULT_PORT: number = 3000;

/**
 * Bootstrap method
 */
const bootstrap = async (): Promise<void> => {
  const app: INestApplication = await NestFactory.create(AppModule, { cors: true });
  setupApp(app);
  app.connectMicroservice({ strategy: new PubSubServer() });
  await app.startAllMicroservices();

  const port: number = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port);
  logger.log(`Application is listening to port ${port}`);
};

bootstrap().catch((err: Error): void => {
  logger.error(err, 'An error occurred when bootstrapping the application');
  process.exit(1);
});
