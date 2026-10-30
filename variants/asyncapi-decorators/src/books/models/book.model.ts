import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from 'asyncapi-decorators';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Species } from '../../animals/enums/species.enum';
import { BookGenre } from '../enums/book-genre.enum';
import { Author, AuthorSchema } from './author.model';

/**
 * A book of the pet-care catalogue
 */
@Schema({ collection: 'Book', timestamps: true, versionKey: false })
export class Book {
  @ApiProperty({ type: 'string' })
  public _id: ObjectId;

  /**
   * ISBN-13, without dashes
   */
  @ApiProperty({ description: 'ISBN-13, without dashes' })
  @Prop({ required: true, unique: true })
  public isbn: string;

  @ApiProperty()
  @Prop({ required: true })
  public title: string;

  @ApiProperty({ items: { $ref: '#/components/schemas/Author' } as never })
  @Prop({ type: [AuthorSchema], required: true })
  public authors: Author[];

  @ApiProperty({ type: 'string', enum: Object.values(BookGenre) })
  @Prop({ type: String, enum: BookGenre, required: true })
  public genre: BookGenre;

  @ApiProperty({ format: 'date-time' })
  @Prop()
  public publishedOn?: Date;

  @ApiProperty()
  @Prop()
  public pageCount?: number;

  /**
   * ISO 639-1 language code
   */
  @ApiProperty({ description: 'ISO 639-1 language code' })
  @Prop({ required: true, default: 'en' })
  public language: string;

  /**
   * Species the book is about
   */
  @ApiProperty({
    description: 'Species the book is about',
    items: { type: 'string', enum: Object.values(Species) },
  })
  @Prop({ type: [String], enum: Species, default: [] })
  public topics: Species[];

  /**
   * Average reader rating, from 0 to 5
   */
  @ApiProperty({ description: 'Average reader rating, from 0 to 5' })
  @Prop()
  public rating?: number;

  @ApiProperty()
  @Prop({ required: true, default: true })
  public available: boolean;

  /**
   * Value added by mongoose
   */
  @ApiProperty({ description: 'Value added by mongoose', format: 'date-time' })
  public createdAt: Date;

  /**
   * Value added by mongoose
   */
  @ApiProperty({ description: 'Value added by mongoose', format: 'date-time' })
  public updatedAt: Date;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
