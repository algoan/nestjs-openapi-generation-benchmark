import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  @ApiProperty({ type: String })
  public _id: ObjectId;

  /**
   * ISBN-13, without dashes
   */
  @Prop({ required: true, unique: true })
  public isbn: string;

  @Prop({ required: true })
  public title: string;

  @Prop({ type: [AuthorSchema], required: true })
  public authors: Author[];

  @Prop({ type: String, enum: BookGenre, required: true })
  public genre: BookGenre;

  @Prop()
  public publishedOn?: Date;

  @Prop()
  public pageCount?: number;

  /**
   * ISO 639-1 language code
   */
  @Prop({ required: true, default: 'en' })
  public language: string;

  /**
   * Species the book is about
   */
  @Prop({ type: [String], enum: Species, default: [] })
  public topics: Species[];

  /**
   * Average reader rating, from 0 to 5
   */
  @Prop()
  public rating?: number;

  @Prop({ required: true, default: true })
  public available: boolean;

  /**
   * Value added by mongoose
   */
  public createdAt: Date;

  /**
   * Value added by mongoose
   */
  public updatedAt: Date;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
