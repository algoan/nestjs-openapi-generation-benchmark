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
import { Roles } from '../core/auth/roles.decorator';
import { Unprotected } from '../core/auth/unprotected.decorator';
import { DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
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
   * @openapi
   * /books:
   *   get:
   *     summary: Search the catalogue
   *     security: []
   *     parameters:
   *       - name: search
   *         in: query
   *         schema:
   *           $ref: '#/components/schemas/SearchBooksDto'
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/limit'
   *       - $ref: '#/components/parameters/filter'
   *       - $ref: '#/components/parameters/sort'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               required: [resources, pagination]
   *               properties:
   *                 resources:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Book'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationLinks'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   */
  @Get()
  @Unprotected()
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Query() searchBooksDto: SearchBooksDto,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Book>> {
    return this.booksService.findAll(searchBooksDto, pagination);
  }

  /**
   * Export the whole catalogue as CSV
   * @openapi
   * /books/export:
   *   get:
   *     summary: Export the whole catalogue as CSV
   *     security: []
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           text/csv:
   *             schema:
   *               type: string
   */
  @Get('export')
  @Unprotected()
  @Header('Content-Type', 'text/csv')
  public async export(): Promise<string> {
    return this.booksService.exportCsv();
  }

  /**
   * Get a book by ISBN
   * @param isbn ISBN-13, without dashes
   * @openapi
   * /books/{isbn}:
   *   get:
   *     summary: Get a book by ISBN
   *     security: []
   *     parameters:
   *       - name: isbn
   *         in: path
   *         required: true
   *         description: ISBN-13, without dashes
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':isbn')
  @Unprotected()
  public async findOne(@Param('isbn') isbn: string): Promise<Book> {
    return this.booksService.findOne(isbn);
  }

  /**
   * Add a book to the catalogue
   * @openapi
   * /books:
   *   post:
   *     summary: Add a book to the catalogue
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateBookDto'
   *     responses:
   *       '201':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '409':
   *         $ref: '#/components/responses/Conflict'
   */
  @Post()
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  /**
   * Replace a book
   * @param isbn ISBN-13, without dashes
   * @openapi
   * /books/{isbn}:
   *   put:
   *     summary: Replace a book
   *     parameters:
   *       - name: isbn
   *         in: path
   *         required: true
   *         description: ISBN-13, without dashes
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ReplaceBookDto'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Put(':isbn')
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async replace(@Param('isbn') isbn: string, @Body() replaceBookDto: ReplaceBookDto): Promise<Book> {
    return this.booksService.replace(isbn, replaceBookDto);
  }

  /**
   * Remove a book from the catalogue
   * @param isbn ISBN-13, without dashes
   * @openapi
   * /books/{isbn}:
   *   delete:
   *     summary: Remove a book from the catalogue
   *     parameters:
   *       - name: isbn
   *         in: path
   *         required: true
   *         description: ISBN-13, without dashes
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: No content
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Delete(':isbn')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [BookAuthRoles.LIBRARIAN] })
  public async remove(@Param('isbn') isbn: string): Promise<void> {
    return this.booksService.remove(isbn);
  }
}
