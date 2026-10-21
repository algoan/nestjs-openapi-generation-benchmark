import { Inject, Queries, Response, Route } from 'tsoa';
import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
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
 * Query parameters of the animal search
 */
interface SearchAnimalsQuery extends SearchAnimalsDto {
  /**
   * Include the animals already adopted
   * @default false
   */
  includeAdopted?: boolean;
}

/**
 * Animals Controller: read-only view over every species
 */
@Controller('shelters/:shelterId/animals')
@Route('shelters/:shelterId/animals')
@Response<HttpError>(401, 'Unauthorized')
@Response<HttpError>(403, 'Forbidden')
@Response<HttpError>(404, 'Not Found')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Search the animals of a shelter
   * @param includeAdopted Include the animals already adopted
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async search(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Inject() @Query() searchAnimalsDto: SearchAnimalsDto,
    @Inject() @Query('includeAdopted', new DefaultValuePipe(false), ParseBoolPipe) includeAdopted: boolean,
    @Queries() _query?: SearchAnimalsQuery,
  ): Promise<(Cat | Dog)[]> {
    return this.animalsService.search(identifier, shelterId, searchAnimalsDto, includeAdopted);
  }

  /**
   * Get an animal, whatever its species
   */
  @Get(':animalId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('animalId', new ParseObjectIdPipe()) animalId: ObjectId,
  ): Promise<Cat | Dog> {
    return this.animalsService.findAnimal(identifier, shelterId, animalId);
  }
}
