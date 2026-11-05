import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { AnimalsModule } from './animals/animals.module';
import { AppController } from './app.controller';
import { BooksModule } from './books/books.module';
import { AuthGuard } from './core/auth/auth.guard';
import { RoleGuard } from './core/auth/role.guard';
import { LoggingInterceptor } from './core/logging/logging.interceptor';
import { PubSubModule } from './core/pubsub/pubsub.module';
import { EventsModule } from './events/events.module';
import { SheltersModule } from './shelters/shelters.module';

/**
 * App Module
 */
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/petstore'),
    PubSubModule,
    SheltersModule,
    AnimalsModule,
    AdoptionsModule,
    BooksModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
