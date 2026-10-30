import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from 'asyncapi-decorators';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

const MAX_NAME_LENGTH: number = 80;

/**
 * Person adopting an animal
 */
@Schema({ _id: false })
export class Adopter {
  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @ApiProperty({ maxLength: MAX_NAME_LENGTH })
  @Prop({ required: true })
  public firstName: string;

  @IsString()
  @MaxLength(MAX_NAME_LENGTH)
  @ApiProperty({ maxLength: MAX_NAME_LENGTH })
  @Prop({ required: true })
  public lastName: string;

  @IsEmail()
  @ApiProperty({ format: 'email' })
  @Prop({ required: true })
  public email: string;

  /**
   * Phone number, in the E.164 format
   */
  @IsOptional()
  @IsPhoneNumber()
  @ApiProperty({ description: 'Phone number, in the E.164 format' })
  @Prop()
  public phone?: string;
}

export const AdopterSchema = SchemaFactory.createForClass(Adopter);
