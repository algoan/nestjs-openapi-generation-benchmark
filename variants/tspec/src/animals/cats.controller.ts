import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
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
   */
  @Post()
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @ApiResponse({ status: 201, type: Cat })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
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
   */
  @Get()
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
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
   */
  @Get(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<Cat> {
    return this.animalsService.findCat(identifier, shelterId, catId);
  }

  /**
   * Update a cat
   */
  @Patch(':catId')
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
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
   */
  @Delete(':catId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('catId', new ParseObjectIdPipe()) catId: ObjectId,
  ): Promise<void> {
    return this.animalsService.removeCat(identifier, shelterId, catId);
  }
}
