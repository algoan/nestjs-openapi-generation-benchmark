import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseEnumPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import * as typoa from 'typoa';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { RejectAdoptionDto } from './dto/reject-adoption.dto';
import { AdoptionAuthRoles } from './enums/adoption-auth-roles.enum';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionReceipt } from './interfaces/adoption-receipt.interface';
import { Adoption, AdoptionDocument } from './models/adoption.model';

/**
 * Adoptions Controller
 */
@Controller('shelters/:shelterId/adoptions')
@typoa.Route('shelters/:shelterId/adoptions')
@typoa.Security({ bearer: [] })
@typoa.Response<HttpError>(401, 'Unauthorized')
@typoa.Response<HttpError>(403, 'Forbidden')
@typoa.Response<HttpError>(404, 'Not Found')
export class AdoptionsController {
  private readonly logger: Logger = new Logger(AdoptionsController.name);

  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * File an adoption request
   * @param requestId Correlation id, echoed in the logs
   */
  @Post()
  @typoa.Response<AdoptionReceipt>(201, 'Created')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  @Log({ mask: ['adopter.email', 'adopter.phone'] })
  public async create(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createAdoptionDto: CreateAdoptionDto,
    @typoa.Header('x-request-id') @Headers('x-request-id') requestId?: string,
  ): Promise<AdoptionReceipt> {
    this.logger.log(`Adoption request ${requestId ?? '-'}`);

    return this.adoptionsService.create(identifier, shelterId, createAdoptionDto);
  }

  /**
   * List the adoption requests of a shelter
   * @param status Only return the requests in this status
   */
  @Get()
  @typoa.Response<PaginatedData<Adoption>>(200, 'Ok')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Request() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @typoa.Query('page') _page: number = 1,
    @typoa.Query('limit') _limit: number = 10,
    @typoa.Query('filter') _filter?: string,
    @typoa.Query('sort') _sort?: string,
    @typoa.Query('status') @Query('status', new ParseEnumPipe(AdoptionRequestStatus, { optional: true })) status?: AdoptionRequestStatus,
  ): Promise<DataToPaginate<Adoption>> {
    return this.adoptionsService.findAll(identifier, shelterId, pagination, status);
  }

  /**
   * Get an adoption request
   */
  @Get(':adoptionId')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  public async findOne(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('adoptionId') @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<Adoption> {
    return this.adoptionsService.findOne(identifier, shelterId, adoptionId);
  }

  /**
   * Approve a pending adoption request
   */
  @Post(':adoptionId/approve')
  @typoa.Response<HttpError>(409, 'Conflict')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async approve(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('adoptionId') @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<Adoption> {
    const adoption: AdoptionDocument = await this.adoptionsService.findOne(identifier, shelterId, adoptionId);
    if (adoption.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictException({
        code: ErrorCodes.CONFLICT,
        message: `Adoption ${adoptionId.toHexString()} has already been decided`,
        status: 409,
      });
    }

    return this.adoptionsService.decide(adoption, AdoptionRequestStatus.APPROVED);
  }

  /**
   * Reject a pending adoption request
   */
  @Post(':adoptionId/reject')
  @typoa.Response<HttpError>(400, 'Bad Request')
  @typoa.Response<HttpError>(409, 'Conflict')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async reject(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('adoptionId') @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
    @Body() rejectAdoptionDto: RejectAdoptionDto,
  ): Promise<Adoption> {
    const adoption: AdoptionDocument = await this.adoptionsService.findOne(identifier, shelterId, adoptionId);
    if (adoption.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictException({
        code: ErrorCodes.CONFLICT,
        message: `Adoption ${adoptionId.toHexString()} has already been decided`,
        status: 409,
      });
    }

    return this.adoptionsService.decide(adoption, AdoptionRequestStatus.REJECTED, rejectAdoptionDto.reason);
  }

  /**
   * Cancel an adoption request
   */
  @Delete(':adoptionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  public async remove(
    @typoa.Request() @User() identifier: Identifier,
    @typoa.Path('shelterId') @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @typoa.Path('adoptionId') @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<void> {
    await this.adoptionsService.remove(identifier, shelterId, adoptionId);
  }
}
