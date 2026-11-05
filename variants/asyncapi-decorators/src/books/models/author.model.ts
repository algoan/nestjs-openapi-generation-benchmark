import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from 'asyncapi-decorators';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const MIN_BIRTH_YEAR: number = 1000;
const MAX_BIRTH_YEAR: number = 2100;

/**
 * Book author
 */
@Schema({ _id: false })
export class Author {
  @IsString()
  @ApiProperty()
  @Prop({ required: true })
  public name: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_BIRTH_YEAR)
  @Max(MAX_BIRTH_YEAR)
  @ApiProperty({ type: 'integer', minimum: MIN_BIRTH_YEAR, maximum: MAX_BIRTH_YEAR })
  @Prop()
  public birthYear?: number;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
