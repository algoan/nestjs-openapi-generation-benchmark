import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DogSize } from '../enums/dog-size.enum';
import { Species } from '../enums/species.enum';
import { Animal } from './animal.model';

/**
 * Dog Model
 */
@Schema({ collection: 'Dog', timestamps: true, versionKey: false })
export class Dog extends Animal {
  @Prop({ type: String, required: true, default: Species.DOG })
  public species: Species.DOG;

  @Prop({ required: true })
  public breed: string;

  @Prop({ type: String, enum: DogSize, required: true })
  public size: DogSize;

  @Prop()
  public goodWithKids?: boolean;
}

export type DogDocument = HydratedDocument<Dog>;
export const DogSchema = SchemaFactory.createForClass(Dog);
