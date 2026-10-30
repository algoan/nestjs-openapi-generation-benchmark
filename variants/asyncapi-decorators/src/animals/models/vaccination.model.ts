import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from 'asyncapi-decorators';
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
  @ApiProperty({ description: 'Vaccine name' })
  @Prop({ required: true })
  public name: string;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ format: 'date-time' })
  @Prop({ required: true })
  public date: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({ format: 'date-time' })
  @Prop()
  public expiresAt?: Date;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
