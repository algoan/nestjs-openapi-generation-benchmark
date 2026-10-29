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
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiProduces } from '@nestjs/swagger';
import { Roles } from '../core/auth/roles.decorator';
import { Unprotected } from '../core/auth/unprotected.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { ApiPaginatedResponse, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
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
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * Search the catalogue
   */
  @Get()
  @Unprotected()
  @ApiPaginatedResponse(Book)
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Query() searchBooksDto: SearchBooksDto,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Book>> {
    return this.booksService.findAll(searchBooksDto, pagination);
  }

  /**
   * Export the whole catalogue as CSV
   */
  @Get('export')
  @Unprotected()
  @Header('Content-Type', 'text/csv')
  @ApiProduces('text/csv')
  public async export(): Promise<string> {
    return this.booksService.exportCsv();
  }

  /**
   * Get a book by ISBN
   * @param isbn ISBN-13, without dashes
   */
  @Get(':isbn')
  @Unprotected()
  @ApiNotFoundResponse({ type: HttpError })
  public async findOne(@Param('isbn') isbn: string): Promise<Book> {
    return this.booksService.findOne(isbn);
  }

  /**
   * Add a book to the catalogue
   */
  @Post()
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  @ApiBadRequestResponse({ type: HttpError })
  @ApiConflictResponse({ type: HttpError })
  public async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  /**
   * Replace a book
   * @param isbn ISBN-13, without dashes
   */
  @Put(':isbn')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  @ApiBadRequestResponse({ type: HttpError })
  @ApiNotFoundResponse({ type: HttpError })
  public async replace(@Param('isbn') isbn: string, @Body() replaceBookDto: ReplaceBookDto): Promise<Book> {
    return this.booksService.replace(isbn, replaceBookDto);
  }

  /**
   * Remove a book from the catalogue
   * @param isbn ISBN-13, without dashes
   */
  @Delete(':isbn')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  @ApiNotFoundResponse({ type: HttpError })
  public async remove(@Param('isbn') isbn: string): Promise<void> {
    return this.booksService.remove(isbn);
  }
}
