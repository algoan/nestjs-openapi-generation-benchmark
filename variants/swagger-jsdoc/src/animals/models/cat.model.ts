import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CoatPattern } from '../enums/coat-pattern.enum';
import { Species } from '../enums/species.enum';
import { Animal } from './animal.model';

/**
 * Cat Model
 * @openapi
 * components:
 *   schemas:
 *     Cat:
 *       allOf:
 *         - $ref: '#/components/schemas/Animal'
 *         - type: object
 *           required: [species, indoor]
 *           properties:
 *             species:
 *               type: string
 *               enum: [CAT]
 *             indoor:
 *               type: boolean
 *               description: Whether the cat must live indoors
 *             coatPattern:
 *               $ref: '#/components/schemas/CoatPattern'
 */
@Schema({ collection: 'Cat', timestamps: true, versionKey: false })
export class Cat extends Animal {
  @Prop({ type: String, required: true, default: Species.CAT })
  public species: Species.CAT;

  /**
   * Whether the cat must live indoors
   */
  @Prop({ required: true })
  public indoor: boolean;

  @Prop({ type: String, enum: CoatPattern })
  public coatPattern?: CoatPattern;
}

export type CatDocument = HydratedDocument<Cat>;
export const CatSchema = SchemaFactory.createForClass(Cat);
