import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shelter, ShelterSchema } from './models/shelter.model';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';

/**
 * Shelters Module
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Shelter.name, schema: ShelterSchema }])],
  controllers: [SheltersController],
  providers: [SheltersService],
  exports: [SheltersService],
})
export class SheltersModule {}
