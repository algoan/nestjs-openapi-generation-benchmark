import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ShelterStatus } from '../enums/shelter-status.enum';
import { Address, AddressSchema } from './address.model';

/**
 * Shelter Model
 */
@Schema({
  collection: 'Shelter',
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_doc: unknown, ret: Partial<Shelter>): Partial<Shelter> => {
      delete ret.isDeleted;

      return ret;
    },
  },
})
export class Shelter {
  public _id: ObjectId;

  /**
   * Display name of the shelter
   */
  @Prop({ required: true })
  public name: string;

  /**
   * ISO 3166-1 alpha-2 country code
   */
  @Prop({ required: true })
  public country: string;

  @Prop({ type: AddressSchema })
  public address?: Address;

  /**
   * Contact email
   */
  @Prop()
  public email?: string;

  /**
   * Maximum number of animals the shelter can host
   */
  @Prop({ required: true, default: 0 })
  public capacity: number;

  @Prop({ type: String, enum: ShelterStatus, required: true, default: ShelterStatus.OPEN })
  public status: ShelterStatus;

  @Prop({ type: [String], default: [] })
  public tags: string[];

  /**
   * Free-form data attached by the caller
   */
  @Prop({ type: MongooseSchema.Types.Mixed })
  public metadata?: Record<string, unknown>;

  /**
   * Soft-delete flag, removed from the responses
   * @internal
   */
  @Prop({ required: true, default: false })
  public isDeleted?: boolean;

  /**
   * Value added by mongoose
   */
  public createdAt: Date;

  /**
   * Value added by mongoose
   */
  public updatedAt: Date;
}

export type ShelterDocument = HydratedDocument<Shelter>;
export const ShelterSchema = SchemaFactory.createForClass(Shelter);
