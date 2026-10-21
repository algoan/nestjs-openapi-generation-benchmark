import { Inject, NoSecurity, Produces, Queries, Res, Response, Route, SuccessResponse, TsoaResponse } from 'tsoa';
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
import { HttpError } from '../core/interfaces/http-error.interface';
import { Roles } from '../core/auth/roles.decorator';
import { Unprotected } from '../core/auth/unprotected.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams, PaginationQuery } from '../core/pagination';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ReplaceBookDto } from './dto/replace-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';
import { BookAuthRoles } from './enums/book-auth-roles.enum';
import { Book } from './models/book.model';

/**
 * Query parameters of the catalogue search
 */
interface SearchBooksQuery extends SearchBooksDto, PaginationQuery {}

/**
 * Books Controller: the public pet-care catalogue
 */
@Controller('books')
@Route('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Search the catalogue
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @Unprotected()
  @NoSecurity()
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Inject() @Query() searchBooksDto: SearchBooksDto,
    @Inject() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Queries() _query?: SearchBooksQuery,
    @Res() _paginated?: TsoaResponse<200, PaginatedData<Book>>,
  ): Promise<DataToPaginate<Book>> {
    return this.booksService.findAll(searchBooksDto, pagination);
  }

  /**
   * Export the whole catalogue as CSV
   */
  @Get('export')
  @Unprotected()
  @NoSecurity()
  @Header('Content-Type', 'text/csv')
  @Produces('text/csv')
  public async export(): Promise<string> {
    return this.booksService.exportCsv();
  }

  /**
   * Get a book by ISBN
   * @param isbn ISBN-13, without dashes
   */
  @Get(':isbn')
  @Response<HttpError>(404, 'Not Found')
  @Unprotected()
  @NoSecurity()
  public async findOne(@Param('isbn') isbn: string): Promise<Book> {
    return this.booksService.findOne(isbn);
  }

  /**
   * Add a book to the catalogue
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<HttpError>(400, 'Bad Request')
  @Response<HttpError>(401, 'Unauthorized')
  @Response<HttpError>(403, 'Forbidden')
  @Response<HttpError>(409, 'Conflict')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  /**
   * Replace a book
   * @param isbn ISBN-13, without dashes
   */
  @Put(':isbn')
  @Response<HttpError>(400, 'Bad Request')
  @Response<HttpError>(401, 'Unauthorized')
  @Response<HttpError>(403, 'Forbidden')
  @Response<HttpError>(404, 'Not Found')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async replace(@Param('isbn') isbn: string, @Body() replaceBookDto: ReplaceBookDto): Promise<Book> {
    return this.booksService.replace(isbn, replaceBookDto);
  }

  /**
   * Remove a book from the catalogue
   * @param isbn ISBN-13, without dashes
   */
  @Delete(':isbn')
  @Response<HttpError>(401, 'Unauthorized')
  @Response<HttpError>(403, 'Forbidden')
  @Response<HttpError>(404, 'Not Found')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async remove(@Param('isbn') isbn: string): Promise<void> {
    return this.booksService.remove(isbn);
  }
}
