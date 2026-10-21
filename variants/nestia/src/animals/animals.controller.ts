import { Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { SearchAnimalsDto } from './dto/search-animals.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Cat } from './models/cat.model';
import { Dog } from './models/dog.model';
import { ApiErrors } from '../core/swagger/api-errors.decorator';

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
  @ApiErrors(400, 404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async search(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Query() searchAnimalsDto: SearchAnimalsDto,
    @Query('includeAdopted', new DefaultValuePipe(false), ParseBoolPipe) includeAdopted: boolean,
  ): Promise<(Cat | Dog)[]> {
    return this.animalsService.search(identifier, new ObjectId(shelterId), searchAnimalsDto, includeAdopted);
  }

  /**
   * Get an animal, whatever its species
   */
  @Get(':animalId')
  @ApiErrors(404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('animalId', new ParseObjectIdPipe()) animalId: string,
  ): Promise<Cat | Dog> {
    return this.animalsService.findAnimal(identifier, new ObjectId(shelterId), new ObjectId(animalId));
  }
}
