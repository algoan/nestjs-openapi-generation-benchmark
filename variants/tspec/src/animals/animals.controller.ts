import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Search the animals of a shelter
   * @param includeAdopted Include the animals already adopted
   */
  @Get()
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async search(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Query() searchAnimalsDto: SearchAnimalsDto,
    @Query('includeAdopted', new DefaultValuePipe(false), ParseBoolPipe) includeAdopted: boolean,
  ): Promise<(Cat | Dog)[]> {
    return this.animalsService.search(identifier, shelterId, searchAnimalsDto, includeAdopted);
  }

  /**
   * Get an animal, whatever its species
   */
  @Get(':animalId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('animalId', new ParseObjectIdPipe()) animalId: ObjectId,
  ): Promise<Cat | Dog> {
    return this.animalsService.findAnimal(identifier, shelterId, animalId);
  }
}
