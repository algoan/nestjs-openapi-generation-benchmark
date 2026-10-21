import { Inject, Queries, Res, Response, Route, SuccessResponse, TsoaResponse } from 'tsoa';
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams, PaginationQuery } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Dog } from './models/dog.model';

/**
 * Dogs Controller
 */
@Controller('shelters/:shelterId/dogs')
@Route('shelters/:shelterId/dogs')
@Response<HttpError>(401, 'Unauthorized')
@Response<HttpError>(403, 'Forbidden')
@Response<HttpError>(404, 'Not Found')
@Roles({ roles: [AnimalAuthRoles.ANIMAL_READER, AnimalAuthRoles.ANIMAL_EDITOR] })
export class DogsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a dog in a shelter
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<HttpError>(400, 'Bad Request')
  @Log()
  public async create(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createDogDto: CreateDogDto,
  ): Promise<Dog> {
    return this.animalsService.createDog(identifier, shelterId, createDogDto);
  }

  /**
   * List the dogs of a shelter
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Inject() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Queries() _query?: PaginationQuery,
    @Res() _paginated?: TsoaResponse<200, PaginatedData<Dog>>,
  ): Promise<DataToPaginate<Dog>> {
    return this.animalsService.findDogs(identifier, shelterId, pagination);
  }

  /**
   * Get a dog
   */
  @Get(':dogId')
  public async findOne(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('dogId', new ParseObjectIdPipe()) dogId: ObjectId,
  ): Promise<Dog> {
    return this.animalsService.findDog(identifier, shelterId, dogId);
  }
}
