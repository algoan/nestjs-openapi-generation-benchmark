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
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { ApiPaginatedResponse, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
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
   */
  @Post()
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  @ApiBadRequestResponse({ type: HttpError })
  @Log({ mask: ['email'] })
  public async create(@User() identifier: Identifier, @Body() createShelterDto: CreateShelterDto): Promise<Shelter> {
    return this.sheltersService.create(identifier, createShelterDto);
  }

  /**
   * List the shelters the caller has access to
   */
  @Get()
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @ApiPaginatedResponse(Shelter)
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
   */
  @Get(':id')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @ApiOkResponse({ type: Shelter })
  @ApiNotFoundResponse({ type: HttpError })
  public async findOne(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    return this.sheltersService.findOne(identifier, id);
  }

  /**
   * Update a shelter
   * @param id The shelter id
   */
  @Patch(':id')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_EDITOR] })
  @ApiBadRequestResponse({ type: HttpError })
  @ApiNotFoundResponse({ type: HttpError })
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
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  @ApiNotFoundResponse({ type: HttpError })
  public async remove(@User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    await this.sheltersService.remove(identifier, id);
  }

  /**
   * Get the yearly statistics of a shelter
   * @param id The shelter id
   * @param year The year of the statistics
   */
  @Get(':id/stats')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @ApiBadRequestResponse({ type: HttpError })
  @ApiNotFoundResponse({ type: HttpError })
  public async getStats(
    @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
    @Query('year', ParseIntPipe) year: number,
  ): Promise<ShelterStats> {
    return this.sheltersService.getStats(identifier, id, year);
  }
}
