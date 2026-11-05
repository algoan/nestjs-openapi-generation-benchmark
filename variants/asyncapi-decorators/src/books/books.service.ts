import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ApiChannel } from 'asyncapi-decorators';
import { FilterQuery, Model } from 'mongoose';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { DataToPaginate, MongoPagination } from '../core/pagination';
import { PUBSUB_CLIENT } from '../core/pubsub/pubsub.constants';
import { EventName } from '../events/enums/event-name.enum';
import { CreateBookDto } from './dto/create-book.dto';
import { ReplaceBookDto } from './dto/replace-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { Author } from './models/author.model';
import { Book, BookDocument } from './models/book.model';

const DUPLICATE_KEY_ERROR: number = 11000;

/**
 * Books Service
 */
@ApiChannel(EventName.BOOK_PUBLISHED, { subscribe: Book })
@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @Inject(PUBSUB_CLIENT) private readonly pubSubClient: ClientProxy,
  ) {}

  public async create(dto: CreateBookDto): Promise<BookDocument> {
    let book: BookDocument;
    try {
      book = await this.bookModel.create(dto);
    } catch (err) {
      if ((err as { code?: number }).code === DUPLICATE_KEY_ERROR) {
        throw new ConflictException({
          code: ErrorCodes.CONFLICT,
          message: `Book ${dto.isbn} already exists`,
          status: 409,
        });
      }
      throw err;
    }
    this.pubSubClient.emit(EventName.BOOK_PUBLISHED, book);

    return book;
  }

  public async findAll(search: SearchBooksDto, pagination: MongoPagination): Promise<DataToPaginate<BookDocument>> {
    const filter: FilterQuery<Book> = { ...pagination.filter };
    if (search.genre !== undefined) {
      filter.genre = search.genre;
    }
    if (search.search !== undefined) {
      const regex: RegExp = new RegExp(search.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: regex }, { 'authors.name': regex }];
    }
    const [resources, totalResources] = await Promise.all([
      this.bookModel.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      this.bookModel.countDocuments(filter),
    ]);

    return { resources, totalResources };
  }

  public async findOne(isbn: string): Promise<BookDocument> {
    const book: BookDocument | null = await this.bookModel.findOne({ isbn });
    if (book === null) {
      throw new NotFoundException({
        code: ErrorCodes.UNKNOWN_ENTITY,
        message: `Book ${isbn} has not been found`,
        status: 404,
      });
    }

    return book;
  }

  public async replace(isbn: string, dto: ReplaceBookDto): Promise<BookDocument> {
    const book: BookDocument = await this.findOne(isbn);
    book.overwrite({ ...dto, isbn });

    return book.save();
  }

  public async remove(isbn: string): Promise<void> {
    const book: BookDocument = await this.findOne(isbn);
    await book.deleteOne();
  }

  public async exportCsv(): Promise<string> {
    const books: Book[] = await this.bookModel.find().lean();
    const lines: string[] = books.map((book: Book): string =>
      [book.isbn, book.title, book.authors.map((author: Author): string => author.name).join('|'), book.genre]
        .map((value: string): string => `"${value.replace(/"/g, '""')}"`)
        .join(','),
    );

    return ['isbn,title,authors,genre', ...lines].join('\n');
  }
}
