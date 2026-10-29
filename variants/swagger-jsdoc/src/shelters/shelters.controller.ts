import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterAuthRoles } from './enums/shelter-auth-roles.enum';
import { ShelterStats } from './interfaces/shelter-stats.interface';
import { Shelter } from './models/shelter.model';
import { SheltersService } from './shelters.service';

/**
 * Shelters Controller
 */
@Controller('shelters')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  /**
   * Create a shelter
   * @openapi
   * /shelters:
   *   post:
   *     summary: Create a shelter
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateShelterDto'
   *     responses:
   *       '201':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shelter'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  @Post()
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  @Log({ mask: ['email'] })
  public async create(@User() identifier: Identifier, @Body() createShelterDto: CreateShelterDto): Promise<Shelter> {
    return this.sheltersService.create(identifier, createShelterDto);
  }

  /**
   * List the shelters the caller has access to
   * @openapi
   * /shelters:
   *   get:
   *     summary: List the shelters the caller has access to
   *     parameters:
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
   *                     $ref: '#/components/schemas/Shelter'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationLinks'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   */
  @Get()
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @User() identifier: Identifier,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Shelter>> {
    return this.sheltersService.findAll(identifier, pagination);
  }

  /**
   * Get a shelter by id
   * @param id The shelter id
   * @openapi
   * /shelters/{id}:
   *   get:
   *     summary: Get a shelter by id
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The shelter id
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shelter'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':id')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async findOne(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.sheltersService.findOne(identifier, id);
  }

  /**
   * Update a shelter
   * @param id The shelter id
   * @openapi
   * /shelters/{id}:
   *   patch:
   *     summary: Update a shelter
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The shelter id
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateShelterDto'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Shelter'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Patch(':id')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_EDITOR] })
  @Log({ mask: ['email'] })
  public async update(
    @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
    @Body() updateShelterDto: UpdateShelterDto,
  ): Promise<Shelter> {
    return this.sheltersService.update(identifier, id, updateShelterDto);
  }

  /**
   * Delete a shelter
   * @param id The shelter id
   * @openapi
   * /shelters/{id}:
   *   delete:
   *     summary: Delete a shelter
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The shelter id
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: Deleted
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  public async remove(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    await this.sheltersService.remove(identifier, id);
  }

  /**
   * Get the yearly statistics of a shelter
   * @param id The shelter id
   * @param year The year of the statistics
   * @openapi
   * /shelters/{id}/stats:
   *   get:
   *     summary: Get the yearly statistics of a shelter
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: The shelter id
   *         schema:
   *           type: string
   *       - name: year
   *         in: query
   *         required: true
   *         description: The year of the statistics
   *         schema:
   *           type: integer
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ShelterStats'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':id/stats')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async getStats(
    @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
    @Query('year', ParseIntPipe) year: number,
  ): Promise<ShelterStats> {
    return this.sheltersService.getStats(identifier, id, year);
  }
}
