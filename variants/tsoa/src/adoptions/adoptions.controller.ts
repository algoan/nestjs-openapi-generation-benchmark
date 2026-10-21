import { Header, Inject, Queries, Res, Response, Route, SuccessResponse, TsoaResponse } from 'tsoa';
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
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginatedData, PaginationBodyInterceptor, PaginationParams, PaginationQuery } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { RejectAdoptionDto } from './dto/reject-adoption.dto';
import { AdoptionAuthRoles } from './enums/adoption-auth-roles.enum';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionReceipt } from './interfaces/adoption-receipt.interface';
import { Adoption, AdoptionDocument } from './models/adoption.model';

/**
 * Query parameters of the adoption list
 */
interface ListAdoptionsQuery extends PaginationQuery {
  /**
   * Only return the requests in this status
   */
  status?: AdoptionRequestStatus;
}

/**
 * Adoptions Controller
 */
@Controller('shelters/:shelterId/adoptions')
@Route('shelters/:shelterId/adoptions')
@Response<HttpError>(401, 'Unauthorized')
@Response<HttpError>(403, 'Forbidden')
@Response<HttpError>(404, 'Not Found')
export class AdoptionsController {
  private readonly logger: Logger = new Logger(AdoptionsController.name);

  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * File an adoption request
   * @param requestId Correlation id, echoed in the logs
   */
  @Post()
  @SuccessResponse(201, 'Created')
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  @Log({ mask: ['adopter.email', 'adopter.phone'] })
  public async create(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createAdoptionDto: CreateAdoptionDto,
    @Header('x-request-id') @Headers('x-request-id') requestId?: string,
  ): Promise<AdoptionReceipt> {
    this.logger.log(`Adoption request ${requestId ?? '-'}`);

    return this.adoptionsService.create(identifier, shelterId, createAdoptionDto);
  }

  /**
   * List the adoption requests of a shelter
   */
  @Get()
  @Response<HttpError>(400, 'Bad Request')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Inject() @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Inject() @Query('status', new ParseEnumPipe(AdoptionRequestStatus, { optional: true })) status?: AdoptionRequestStatus,
    @Queries() _query?: ListAdoptionsQuery,
    @Res() _paginated?: TsoaResponse<200, PaginatedData<Adoption>>,
  ): Promise<DataToPaginate<Adoption>> {
    return this.adoptionsService.findAll(identifier, shelterId, pagination, status);
  }

  /**
   * Get an adoption request
   */
  @Get(':adoptionId')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  public async findOne(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<Adoption> {
    return this.adoptionsService.findOne(identifier, shelterId, adoptionId);
  }

  /**
   * Approve a pending adoption request
   */
  @Post(':adoptionId/approve')
  @Response<HttpError>(409, 'Conflict')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async approve(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
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
  @Response<HttpError>(400, 'Bad Request')
  @Response<HttpError>(409, 'Conflict')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async reject(
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
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
    @Inject() @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<void> {
    await this.adoptionsService.remove(identifier, shelterId, adoptionId);
  }
}
