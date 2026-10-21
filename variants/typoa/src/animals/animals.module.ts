import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { CatsController } from './cats.controller';
import { DogsController } from './dogs.controller';
import { Cat, CatSchema } from './models/cat.model';
import { Dog, DogSchema } from './models/dog.model';

/**
 * Animals Module
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Dog.name, schema: DogSchema },
    ]),
  ],
  controllers: [CatsController, DogsController, AnimalsController],
  providers: [AnimalsService],
  exports: [AnimalsService],
})
export class AnimalsModule {}
