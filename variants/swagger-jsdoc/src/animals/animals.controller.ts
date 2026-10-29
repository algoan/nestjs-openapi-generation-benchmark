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

/**
 * Animals Controller: read-only view over every species
 */
@Controller('shelters/:shelterId/animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Search the animals of a shelter
   * @param includeAdopted Include the animals already adopted
   * @openapi
   * /shelters/{shelterId}/animals:
   *   get:
   *     summary: Search the animals of a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: search
   *         in: query
   *         schema:
   *           $ref: '#/components/schemas/SearchAnimalsDto'
   *       - name: includeAdopted
   *         in: query
   *         description: Include the animals already adopted
   *         schema:
   *           type: boolean
   *           default: false
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 anyOf:
   *                   - $ref: '#/components/schemas/Cat'
   *                   - $ref: '#/components/schemas/Dog'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get()
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
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
   * @openapi
   * /shelters/{shelterId}/animals/{animalId}:
   *   get:
   *     summary: Get an animal, whatever its species
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: animalId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               anyOf:
   *                 - $ref: '#/components/schemas/Cat'
   *                 - $ref: '#/components/schemas/Dog'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':animalId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('animalId', new ParseObjectIdPipe()) animalId: ObjectId,
  ): Promise<Cat | Dog> {
    return this.animalsService.findAnimal(identifier, shelterId, animalId);
  }
}
