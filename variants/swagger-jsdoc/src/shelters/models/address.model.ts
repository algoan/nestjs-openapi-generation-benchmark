import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString, MaxLength } from 'class-validator';

const MAX_LINE_LENGTH: number = 120;

/**
 * Postal address
 * @openapi
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required: [street, city, postalCode]
 *       properties:
 *         street:
 *           type: string
 *           maxLength: 120
 *         city:
 *           type: string
 *         postalCode:
 *           type: string
 *         complement:
 *           type: string
 *           description: Building, floor, etc.
 */
@Schema({ _id: false })
export class Address {
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
