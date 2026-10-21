import { Inject, Queries, Res, Response, Route, SuccessResponse, TsoaResponse } from 'tsoa';
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
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams, PaginationQuery } from '../core/pagination';
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
@Route('shelters')
@Response<HttpError>(401, 'Unauthorized')
@Response<HttpError>(403, 'Forbidden')
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  /**
   * Create a shelter
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  @Log({ mask: ['email'] })
  public async create(@Inject() @User() identifier: Identifier, @Body() createShelterDto: CreateShelterDto): Promise<Shelter> {
    return this.sheltersService.create(identifier, createShelterDto);
  }

  /**
   * List the shelters the caller has access to
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Inject() @User() identifier: Identifier,
    @Inject() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Queries() _query?: PaginationQuery,
    @Res() _paginated?: TsoaResponse<200, PaginatedData<Shelter>>,
  ): Promise<DataToPaginate<Shelter>> {
    return this.sheltersService.findAll(identifier, pagination);
  }

  /**
   * Get a shelter by id
   * @param id The shelter id
   */
  @Get(':id')
  @Response<HttpError>(404, 'Not Found')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async findOne(@Inject() @User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId): Promise<Shelter> {
    return this.sheltersService.findOne(identifier, id);
  }

  /**
   * Update a shelter
   * @param id The shelter id
   */
  @Patch(':id')
  @Response<HttpError>(400, 'Bad Request')
  @Response<HttpError>(404, 'Not Found')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_EDITOR] })
  @Log({ mask: ['email'] })
  public async update(
    @Inject() @User() identifier: Identifier,
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
  @Response<HttpError>(404, 'Not Found')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [ShelterAuthRoles.SHELTER_ADMIN] })
  public async remove(@Inject() @User() identifier: Identifier, @Param('id', new ParseObjectIdPipe()) id: ObjectId) {
    await this.sheltersService.remove(identifier, id);
  }

  /**
   * Get the yearly statistics of a shelter
   * @param id The shelter id
   * @param year The year of the statistics
   * @isInt year
   */
  @Get(':id/stats')
  @Response<HttpError>(400, 'Bad Request')
  @Response<HttpError>(404, 'Not Found')
  @Roles({ roles: [ShelterAuthRoles.SHELTER_READER] })
  public async getStats(
    @Inject() @User() identifier: Identifier,
    @Param('id', new ParseObjectIdPipe()) id: ObjectId,
    @Query('year', ParseIntPipe) year: number,
  ): Promise<ShelterStats> {
    return this.sheltersService.getStats(identifier, id, year);
  }
}
