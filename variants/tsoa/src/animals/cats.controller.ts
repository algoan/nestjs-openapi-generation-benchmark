import { Inject, Queries, Res, Response, Route, SuccessResponse, TsoaResponse } from 'tsoa';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams, PaginationQuery } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Cat } from './models/cat.model';

/**
 * Cats Controller
 */
@Controller('shelters/:shelterId/cats')
@Route('shelters/:shelterId/cats')
@Response<HttpError>(401, 'Unauthorized')
@Response<HttpError>(403, 'Forbidden')
@Response<HttpError>(404, 'Not Found')
export class CatsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a cat in a shelter
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async create(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.animalsService.createCat(identifier, shelterId, createCatDto);
  }

  /**
   * List the cats of a shelter
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Inject() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Queries() _query?: PaginationQuery,
    @Res() _paginated?: TsoaResponse<200, PaginatedData<Cat>>,
  ): Promise<DataToPaginate<Cat>> {
    return this.animalsService.findCats(identifier, shelterId, pagination);
  }

  /**
   * Get a cat
   */
  @Get(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<Cat> {
    return this.animalsService.findCat(identifier, shelterId, catId);
  }

  /**
   * Update a cat
   */
  @Patch(':catId')
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async update(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return this.animalsService.updateCat(identifier, shelterId, catId, updateCatDto);
  }

  /**
   * Remove a cat from a shelter
   */
  @Delete(':catId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  public async remove(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<void> {
    return this.animalsService.removeCat(identifier, shelterId, catId);
  }
}
