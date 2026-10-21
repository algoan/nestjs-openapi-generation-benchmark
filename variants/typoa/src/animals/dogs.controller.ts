import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
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
import { CreateDogDto } from './dto/create-dog.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Dog } from './models/dog.model';

/**
 * Dogs Controller
 */
@Controller('shelters/:shelterId/dogs')
@typoa.Route('shelters/:shelterId/dogs')
@typoa.Security({ bearer: [] })
@typoa.Response<HttpError>(401, 'Unauthorized')
@typoa.Response<HttpError>(403, 'Forbidden')
@typoa.Response<HttpError>(404, 'Not Found')
@Roles({ roles: [AnimalAuthRoles.ANIMAL_READER, AnimalAuthRoles.ANIMAL_EDITOR] })
export class DogsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a dog in a shelter
   */
  @Post()
  @typoa.Response<Dog>(201, 'Created')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Log()
  public async create(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createDogDto: CreateDogDto,
  ): Promise<Dog> {
    return this.animalsService.createDog(identifier, shelterId, createDogDto);
  }

  /**
   * List the dogs of a shelter
   */
  @Get()
  @typoa.Response<PaginatedData<Dog>>(200, 'Ok')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Request() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @typoa.Query('page') _page: number = 1,
    @typoa.Query('limit') _limit: number = 10,
    @typoa.Query('filter') _filter?: string,
    @typoa.Query('sort') _sort?: string,
  ): Promise<DataToPaginate<Dog>> {
    return this.animalsService.findDogs(identifier, shelterId, pagination);
  }

  /**
   * Get a dog
   */
  @Get(':dogId')
  public async findOne(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('dogId') @Param('dogId', new ParseObjectIdPipe()) dogId: ObjectId,
  ): Promise<Dog> {
    return this.animalsService.findDog(identifier, shelterId, dogId);
  }
}
