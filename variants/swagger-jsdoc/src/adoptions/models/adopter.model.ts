import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

const MAX_NAME_LENGTH: number = 80;

/**
 * Person adopting an animal
 * @openapi
 * components:
 *   schemas:
 *     Adopter:
 *       type: object
 *       required: [firstName, lastName, email]
 *       properties:
 *         firstName:
 *           type: string
 *           maxLength: 80
 *         lastName:
 *           type: string
 *           maxLength: 80
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           description: Phone number, in the E.164 format
 */
@Schema({ _id: false })
export class Adopter {
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @Prop({ required: true })
  public firstName: string;

  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @Prop({ required: true })
  public lastName: string;

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
