import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

const MAX_NAME_LENGTH: number = 80;

/**
 * Person adopting an animal
 */
@Schema({ _id: false })
export class Adopter {
  /** @maxLength 80 */
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @Prop({ required: true })
  public firstName: string;

  /** @maxLength 80 */
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @Prop({ required: true })
  public lastName: string;

  /** @format email */
  @IsEmail()
  @Prop({ required: true })
  public email: string;

  /**
   * Phone number, in the E.164 format
   */
  @IsOptional()
  @IsPhoneNumber()
  @Prop()
  public phone?: string;
}

export const AdopterSchema = SchemaFactory.createForClass(Adopter);
