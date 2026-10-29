import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Cat } from './models/cat.model';

/**
 * Cats Controller
 */
@Controller('shelters/:shelterId/cats')
export class CatsController {
  constructor(private readonly animalsService: AnimalsService) {}

  /**
   * Register a cat in a shelter
   * @openapi
   * /shelters/{shelterId}/cats:
   *   post:
   *     summary: Register a cat in a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCatDto'
   *     responses:
   *       '201':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cat'
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
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.animalsService.createCat(identifier, shelterId, createCatDto);
  }

  /**
   * List the cats of a shelter
   * @openapi
   * /shelters/{shelterId}/cats:
   *   get:
   *     summary: List the cats of a shelter
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
   *                     $ref: '#/components/schemas/Cat'
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
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Cat>> {
    return this.animalsService.findCats(identifier, shelterId, pagination);
  }

  /**
   * Get a cat
   * @openapi
   * /shelters/{shelterId}/cats/{catId}:
   *   get:
   *     summary: Get a cat
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: catId
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
   *               $ref: '#/components/schemas/Cat'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ) {
    return this.animalsService.findCat(identifier, shelterId, catId);
  }

  /**
   * Update a cat
   * @openapi
   * /shelters/{shelterId}/cats/{catId}:
   *   patch:
   *     summary: Update a cat
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: catId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCatDto'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cat'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Patch(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async update(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return this.animalsService.updateCat(identifier, shelterId, catId, updateCatDto);
  }

  /**
   * Remove a cat from a shelter
   * @openapi
   * /shelters/{shelterId}/cats/{catId}:
   *   delete:
   *     summary: Remove a cat from a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: catId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: No content
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Delete(':catId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<void> {
    return this.animalsService.removeCat(identifier, shelterId, catId);
  }
}
