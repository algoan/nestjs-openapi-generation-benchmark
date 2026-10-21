import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { ApiPaginated, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateDogDto } from './dto/create-dog.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Dog } from './models/dog.model';
import { ApiErrors } from '../core/swagger/api-errors.decorator';

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
  @ApiErrors(400, 404)
  @Log()
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Body() createDogDto: CreateDogDto,
  ): Promise<Dog> {
    return this.animalsService.createDog(identifier, new ObjectId(shelterId), createDogDto);
  }

  /**
   * List the dogs of a shelter
   */
  @Get()
  @ApiErrors(400, 404)
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  @ApiPaginated({ perPageName: 'limit' })
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Dog>> {
    return this.animalsService.findDogs(identifier, new ObjectId(shelterId), pagination);
  }

  /**
   * Get a dog
   */
  @Get(':dogId')
  @ApiErrors(404)
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('dogId', new ParseObjectIdPipe()) dogId: string,
  ): Promise<Dog> {
    return this.animalsService.findDog(identifier, new ObjectId(shelterId), new ObjectId(dogId));
  }
}
