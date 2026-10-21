import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import * as typoa from 'typoa';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { SearchAnimalsDto } from './dto/search-animals.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Cat } from './models/cat.model';
import { Dog } from './models/dog.model';

/**
 * Animals Controller: read-only view over every species
 */
@Controller('shelters/:shelterId/animals')
@typoa.Route('shelters/:shelterId/animals')
@typoa.Security({ bearer: [] })
@typoa.Response<HttpError>(401, 'Unauthorized')
@typoa.Response<HttpError>(403, 'Forbidden')
@typoa.Response<HttpError>(404, 'Not Found')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Search the animals of a shelter
   * @param includeAdopted Include the animals already adopted
   */
  @Get()
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async search(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Query() searchAnimalsDto: SearchAnimalsDto,
    @typoa.Query('includeAdopted') @Query('includeAdopted', new DefaultValuePipe(false), ParseBoolPipe) includeAdopted: boolean = false,
  ): Promise<(Cat | Dog)[]> {
    return this.animalsService.search(identifier, shelterId, searchAnimalsDto, includeAdopted);
  }

  /**
   * Get an animal, whatever its species
   */
  @Get(':animalId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('animalId') @Param('animalId', new ParseObjectIdPipe()) animalId: ObjectId,
  ): Promise<Cat | Dog> {
    return this.animalsService.findAnimal(identifier, shelterId, animalId);
  }
}
