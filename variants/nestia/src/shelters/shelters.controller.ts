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
import { ApiPaginated, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterAuthRoles } from './enums/shelter-auth-roles.enum';
import { ShelterStats } from './interfaces/shelter-stats.interface';
import { Shelter } from './models/shelter.model';
import { SheltersService } from './shelters.service';
import { ApiErrors } from '../core/swagger/api-errors.decorator';

/**
 * Shelters Controller
 */
@Controller('shelters')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  /**
   * Create a shelter
   */
  @Post()
  @ApiErrors(400)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  @Log({ mask: ['email'] })
  public async create(@User() identifier: Identifier, @Body() createShelterDto: CreateShelterDto): Promise<Shelter> {
    return this.sheltersService.create(identifier, createShelterDto);
  }

  /**
   * List the shelters the caller has access to
   */
  @Get()
  @ApiErrors(400)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  @ApiPaginated({ perPageName: 'limit' })
  public async findAll(
    @User() identifier: Identifier,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
  ): Promise<DataToPaginate<Shelter>> {
    return this.sheltersService.findAll(identifier, pagination);
  }

  /**
   * Get a shelter by id
   * @param id The shelter id
   */
  @Get(':id')
  @ApiErrors(404)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async findOne(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: string): Promise<Shelter> {
    return this.sheltersService.findOne(identifier, new ObjectId(id));
  }

  /**
   * Update a shelter
   * @param id The shelter id
   */
  @Patch(':id')
  @ApiErrors(400, 404)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_EDITOR] })
  @Log({ mask: ['email'] })
  public async update(
    @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() updateShelterDto: UpdateShelterDto,
  ): Promise<Shelter> {
    return this.sheltersService.update(identifier, new ObjectId(id), updateShelterDto);
  }

  /**
   * Delete a shelter
   * @param id The shelter id
   */
  @Delete(':id')
  @ApiErrors(404)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  public async remove(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: string): Promise<void> {
    await this.sheltersService.remove(identifier, new ObjectId(id));
  }

  /**
   * Get the yearly statistics of a shelter
   * @param id The shelter id
   * @param year The year of the statistics
   */
  @Get(':id/stats')
  @ApiErrors(400, 404)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async getStats(
    @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Query('year', ParseIntPipe) year: number,
  ): Promise<ShelterStats> {
    return this.sheltersService.getStats(identifier, new ObjectId(id), year);
  }
}
