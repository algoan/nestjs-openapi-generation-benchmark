import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import * as typoa from 'typoa';
import { Roles } from '../core/auth/roles.decorator';
import { Unprotected } from '../core/auth/unprotected.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { HttpError } from '../core/interfaces/http-error.interface';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ReplaceBookDto } from './dto/replace-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { BookAuthRoles } from './enums/book-auth-roles.enum';
import { Book } from './models/book.model';

/**
 * Books Controller: the public pet-care catalogue
 */
@Controller('books')
@typoa.Route('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Search the catalogue
   */
  @Get()
  @typoa.Response<PaginatedData<Book>>(200, 'Ok')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Unprotected()
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Query() searchBooksDto: SearchBooksDto,
    @typoa.Request() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @typoa.Query('page') _page: number = 1,
    @typoa.Query('limit') _limit: number = 10,
    @typoa.Query('filter') _filter?: string,
    @typoa.Query('sort') _sort?: string,
  ): Promise<DataToPaginate<Book>> {
    return this.booksService.findAll(searchBooksDto, pagination);
  }

  /**
   * Export the whole catalogue as CSV
   */
  @Get('export')
  @typoa.Produces('text/csv')
  @Unprotected()
  @Header('Content-Type', 'text/csv')
  public async export(): Promise<string> {
    return this.booksService.exportCsv();
  }

  /**
   * Get a book by ISBN
   * @param isbn ISBN-13, without dashes
   */
  @Get(':isbn')
  @typoa.Response<HttpError>(404, 'Not Found')
  @Unprotected()
  public async findOne(@typoa.Path('isbn') @Param('isbn') isbn: string): Promise<Book> {
    return this.booksService.findOne(isbn);
  }

  /**
   * Add a book to the catalogue
   */
  @Post()
  @typoa.Response<Book>(201, 'Created')
  @typoa.Security({ bearer: [] })
  @typoa.Response<HttpError>(400, 'Bad Request')
  @typoa.Response<HttpError>(401, 'Unauthorized')
  @typoa.Response<HttpError>(403, 'Forbidden')
  @typoa.Response<HttpError>(409, 'Conflict')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  /**
   * Replace a book
   * @param isbn ISBN-13, without dashes
   */
  @Put(':isbn')
  @typoa.Security({ bearer: [] })
  @typoa.Response<HttpError>(400, 'Bad Request')
  @typoa.Response<HttpError>(401, 'Unauthorized')
  @typoa.Response<HttpError>(403, 'Forbidden')
  @typoa.Response<HttpError>(404, 'Not Found')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async replace(@typoa.Path('isbn') @Param('isbn') isbn: string, @Body() replaceBookDto: ReplaceBookDto): Promise<Book> {
    return this.booksService.replace(isbn, replaceBookDto);
  }

  /**
   * Remove a book from the catalogue
   * @param isbn ISBN-13, without dashes
   */
  @Delete(':isbn')
  @typoa.Security({ bearer: [] })
  @typoa.Response<HttpError>(401, 'Unauthorized')
  @typoa.Response<HttpError>(403, 'Forbidden')
  @typoa.Response<HttpError>(404, 'Not Found')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async remove(@typoa.Path('isbn') @Param('isbn') isbn: string): Promise<void> {
    return this.booksService.remove(isbn);
  }
}
