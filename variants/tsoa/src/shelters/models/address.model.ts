import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString, MaxLength } from 'class-validator';

const MAX_LINE_LENGTH: number = 120;

/**
 * Postal address
 */
@Schema({ _id: false })
export class Address {
  /** @maxLength 120 */
  @IsString()
  @MaxLength(MAX_LINE_LENGTH)
  @Prop({ required: true })
  public street: string;

  @IsString()
  @Prop({ required: true })
  public city: string;

  @IsString()
  @Prop({ required: true })
  public postalCode: string;

  /**
   * Building, floor, etc.
   */
  @IsOptional()
  @IsString()
  @Prop()
  public complement?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
