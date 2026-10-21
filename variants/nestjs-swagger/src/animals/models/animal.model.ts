import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema } from 'mongoose';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { Sex } from '../enums/sex.enum';
import { Species } from '../enums/species.enum';
import { Vaccination, VaccinationSchema } from './vaccination.model';

/**
 * Fields shared by every animal
 */
export abstract class Animal {
  @ApiProperty({ type: String })
  public _id: ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  public shelterId: ObjectId;

  public abstract species: Species;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public birthDate?: Date;

  @Prop({ type: String, enum: Sex, required: true })
  public sex: Sex;

  @Prop({ type: String, enum: AdoptionStatus, required: true, default: AdoptionStatus.AVAILABLE })
  public status: AdoptionStatus;

  @Prop({ type: [VaccinationSchema], default: [] })
  public vaccinations: Vaccination[];

  /**
   * Weight in kilograms
   */
  @Prop()
  public weightKg?: number;

  /**
   * Value added by mongoose
   */
  public createdAt: Date;

  /**
   * Value added by mongoose
   */
  public updatedAt: Date;
}
