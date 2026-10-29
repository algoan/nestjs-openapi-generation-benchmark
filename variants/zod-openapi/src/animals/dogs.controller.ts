import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Dog } from './models/dog.model';

/**
 * Dogs Controller
 */
@Controller('shelters/:shelterId/dogs')
@Roles({ roles: [AnimalAuthRoles.ANIMAL_READER, AnimalAuthRoles.ANIMAL_EDITOR] })
export class DogsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a dog in a shelter
   */
  @Post()
  @Log()
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createDogDto: CreateDogDto,
  ): Promise<Dog> {
    return this.animalsService.createDog(identifier, shelterId, createDogDto);
  }

  /**
   * List the dogs of a shelter
   */
  @Get()
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Dog>> {
    return this.animalsService.findDogs(identifier, shelterId, pagination);
  }

  /**
   * Get a dog
   */
  @Get(':dogId')
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('dogId', new ParseObjectIdPipe()) dogId: ObjectId,
  ): Promise<Dog> {
    return this.animalsService.findDog(identifier, shelterId, dogId);
  }
}
