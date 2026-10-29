import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Schema as MongooseSchema } from 'mongoose';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { Sex } from '../enums/sex.enum';
import { Species } from '../enums/species.enum';
import { Vaccination, VaccinationSchema } from './vaccination.model';

/**
 * Fields shared by every animal
 * @openapi
 * components:
 *   schemas:
 *     Animal:
 *       type: object
 *       required: [_id, shelterId, name, sex, status, vaccinations, createdAt, updatedAt]
 *       properties:
 *         _id:
 *           type: string
 *         shelterId:
 *           type: string
 *         name:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date-time
 *         sex:
 *           $ref: '#/components/schemas/Sex'
 *         status:
 *           $ref: '#/components/schemas/AdoptionStatus'
 *         vaccinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vaccination'
 *         weightKg:
 *           type: number
 *           description: Weight in kilograms
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 */
export abstract class Animal {
  public _id: ObjectId;

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
