import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import * as typoa from 'typoa';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
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
@typoa.Route('shelters/:shelterId/cats')
@typoa.Security({ bearer: [] })
@typoa.Response<HttpError>(401, 'Unauthorized')
@typoa.Response<HttpError>(403, 'Forbidden')
@typoa.Response<HttpError>(404, 'Not Found')
export class CatsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a cat in a shelter
   */
  @Post()
  @typoa.Response<Cat>(201, 'Created')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async create(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.animalsService.createCat(identifier, shelterId, createCatDto);
  }

  /**
   * List the cats of a shelter
   */
  @Get()
  @typoa.Response<PaginatedData<Cat>>(200, 'Ok')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Request() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @typoa.Query('page') _page: number = 1,
    @typoa.Query('limit') _limit: number = 10,
    @typoa.Query('filter') _filter?: string,
    @typoa.Query('sort') _sort?: string,
  ): Promise<DataToPaginate<Cat>> {
    return this.animalsService.findCats(identifier, shelterId, pagination);
  }

  /**
   * Get a cat
   */
  @Get(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('catId') @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<Cat> {
    return this.animalsService.findCat(identifier, shelterId, catId);
  }

  /**
   * Update a cat
   */
  @Patch(':catId')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async update(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('catId') @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
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
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('catId') @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<void> {
    return this.animalsService.removeCat(identifier, shelterId, catId);
  }
}
