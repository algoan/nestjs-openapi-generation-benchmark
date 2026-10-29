import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

/**
 * A vaccine injection
 */
@Schema({ _id: false })
export class Vaccination {
  /**
   * Vaccine name
   */
  @IsString()
  @Prop({ required: true })
  public name: string;

  @Type(() => Date)
  @IsDate()
  @Prop({ required: true })
  public date: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Prop()
  public expiresAt?: Date;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
