import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdoptionsController } from './adoptions.controller';
import { AdoptionsService } from './adoptions.service';
import { Adoption, AdoptionSchema } from './models/adoption.model';

/**
 * Adoptions Module
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Adoption.name, schema: AdoptionSchema }])],
  controllers: [AdoptionsController],
  providers: [AdoptionsService],
})
export class AdoptionsModule {}
