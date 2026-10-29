import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Species } from '../../animals/enums/species.enum';
import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';
import { Adopter, AdopterSchema } from './adopter.model';

/**
 * Adoption Model
 */
@Schema({ collection: 'Adoption', timestamps: true, versionKey: false })
export class Adoption {
  @ApiProperty({ type: String })
  public _id: ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  public shelterId: ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  public animalId: ObjectId;

  @Prop({ type: String, enum: Species, required: true })
  public species: Species;

  @Prop({ type: AdopterSchema, required: true })
  public adopter: Adopter;

  @Prop({ type: String, enum: AdoptionRequestStatus, required: true, default: AdoptionRequestStatus.PENDING })
  public status: AdoptionRequestStatus;

  /**
   * Adoption fee, in euros
   */
  @Prop({ required: true })
  public fee: number;

  @Prop()
  public notes?: string;

  /**
   * Why the request was rejected
   */
  @Prop()
  public rejectionReason?: string;

  /**
   * When the request was approved or rejected
   */
  @Prop()
  public decidedAt?: Date;

  /**
   * Value added by mongoose
   */
  public createdAt: Date;

  /**
   * Value added by mongoose
   */
  public updatedAt: Date;
}

export type AdoptionDocument = HydratedDocument<Adoption>;
export const AdoptionSchema = SchemaFactory.createForClass(Adoption);
