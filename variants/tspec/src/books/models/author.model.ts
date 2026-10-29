import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const MIN_BIRTH_YEAR: number = 1000;
const MAX_BIRTH_YEAR: number = 2100;

/**
 * Book author
 */
@Schema({ _id: false })
export class Author {
  @IsString()
  @Prop({ required: true })
  public name: string;

  /**
   * @minimum 1000
   * @maximum 2100
   */
  @IsOptional()
  @IsInt()
  @Min(MIN_BIRTH_YEAR)
  @Max(MAX_BIRTH_YEAR)
  @Prop()
  public birthYear?: number;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
