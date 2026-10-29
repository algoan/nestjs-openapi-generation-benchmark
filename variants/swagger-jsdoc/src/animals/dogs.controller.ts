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
   * @openapi
   * /shelters/{shelterId}/dogs:
   *   post:
   *     summary: Register a dog in a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDogDto'
   *     responses:
   *       '201':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Dog'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
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
   * @openapi
   * /shelters/{shelterId}/dogs:
   *   get:
   *     summary: List the dogs of a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/limit'
   *       - $ref: '#/components/parameters/filter'
   *       - $ref: '#/components/parameters/sort'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               required: [resources, pagination]
   *               properties:
   *                 resources:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Dog'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationLinks'
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
   * @openapi
   * /shelters/{shelterId}/dogs/{dogId}:
   *   get:
   *     summary: Get a dog
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: dogId
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
   *               $ref: '#/components/schemas/Dog'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
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
