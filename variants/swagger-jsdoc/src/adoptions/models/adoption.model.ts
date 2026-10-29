import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Species } from '../../animals/enums/species.enum';
import { AdoptionRequestStatus } from '../enums/adoption-request-status.enum';
import { Adopter, AdopterSchema } from './adopter.model';

/**
 * Adoption Model
 * @openapi
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       required: [_id, shelterId, animalId, species, adopter, status, fee, createdAt, updatedAt]
 *       properties:
 *         _id:
 *           type: string
 *         shelterId:
 *           type: string
 *         animalId:
 *           type: string
 *         species:
 *           $ref: '#/components/schemas/Species'
 *         adopter:
 *           $ref: '#/components/schemas/Adopter'
 *         status:
 *           $ref: '#/components/schemas/AdoptionRequestStatus'
 *         fee:
 *           type: number
 *           description: Adoption fee, in euros
 *         notes:
 *           type: string
 *         rejectionReason:
 *           type: string
 *           description: Why the request was rejected
 *         decidedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was approved or rejected
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 */
@Schema({ collection: 'Adoption', timestamps: true, versionKey: false })
export class Adoption {
  public _id: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  public shelterId: ObjectId;

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
