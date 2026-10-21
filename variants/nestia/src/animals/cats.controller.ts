import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { ApiPaginated, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AnimalsService } from './animals.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { AnimalAuthRoles } from './enums/animal-auth-roles.enum';
import { Cat } from './models/cat.model';
import { ApiErrors } from '../core/swagger/api-errors.decorator';

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
  @ApiErrors(400, 404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.animalsService.createCat(identifier, new ObjectId(shelterId), createCatDto);
  }

  /**
   * List the cats of a shelter
   */
  @Get()
  @ApiErrors(400, 404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  @ApiPaginated({ perPageName: 'limit' })
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Cat>> {
    return this.animalsService.findCats(identifier, new ObjectId(shelterId), pagination);
  }

  /**
   * Get a cat
   */
  @Get(':catId')
  @ApiErrors(404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('catId', new ParseObjectIdPipe()) catId: string,
  ): Promise<Cat> {
    return this.animalsService.findCat(identifier, new ObjectId(shelterId), new ObjectId(catId));
  }

  /**
   * Update a cat
   */
  @Patch(':catId')
  @ApiErrors(400, 404)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  @Log()
  public async update(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('catId', new ParseObjectIdPipe()) catId: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return this.animalsService.updateCat(identifier, new ObjectId(shelterId), new ObjectId(catId), updateCatDto);
  }

  /**
   * Remove a cat from a shelter
   */
  @Delete(':catId')
  @ApiErrors(404)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AnimalAuthRoles.ANIMAL_EDITOR] })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('catId', new ParseObjectIdPipe()) catId: string,
  ): Promise<void> {
    return this.animalsService.removeCat(identifier, new ObjectId(shelterId), new ObjectId(catId));
  }
}
