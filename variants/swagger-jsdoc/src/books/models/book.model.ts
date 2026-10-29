import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { Species } from '../../animals/enums/species.enum';
import { BookGenre } from '../enums/book-genre.enum';
import { Author, AuthorSchema } from './author.model';

/**
 * A book of the pet-care catalogue
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required: [_id, isbn, title, authors, genre, language, topics, available, createdAt, updatedAt]
 *       properties:
 *         _id:
 *           type: string
 *         isbn:
 *           type: string
 *           description: ISBN-13, without dashes
 *         title:
 *           type: string
 *         authors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Author'
 *         genre:
 *           $ref: '#/components/schemas/BookGenre'
 *         publishedOn:
 *           type: string
 *           format: date-time
 *         pageCount:
 *           type: number
 *         language:
 *           type: string
 *           description: ISO 639-1 language code
 *         topics:
 *           type: array
 *           description: Species the book is about
 *           items:
 *             $ref: '#/components/schemas/Species'
 *         rating:
 *           type: number
 *           description: Average reader rating, from 0 to 5
 *         available:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Value added by mongoose
 */
@Schema({ collection: 'Book', timestamps: true, versionKey: false })
export class Book {
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
