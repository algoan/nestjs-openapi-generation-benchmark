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
import { ApiResponse } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Roles } from '../core/auth/roles.decorator';
import { User } from '../core/decorators/user.decorator';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { HttpError } from '../core/interfaces/http-error.interface';
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
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
export class AdoptionsController {
  private readonly logger: Logger = new Logger(AdoptionsController.name);

  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * File an adoption request
   * @param requestId Correlation id, echoed in the logs
   */
  @Post()
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  @ApiResponse({ status: 201, type: AdoptionReceipt })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  @Log({ mask: ['adopter.email', 'adopter.phone'] })
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Body() createAdoptionDto: CreateAdoptionDto,
    @Headers('x-request-id') requestId?: string,
  ): Promise<AdoptionReceipt> {
    this.logger.log(`Adoption request ${requestId ?? '-'}`);

    return this.adoptionsService.create(identifier, shelterId, createAdoptionDto);
  }

  /**
   * List the adoption requests of a shelter
   * @param status Only return the requests in this status
   */
  @Get()
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Query('status', new ParseEnumPipe(AdoptionRequestStatus, { optional: true })) status?: AdoptionRequestStatus,
  ): Promise<DataToPaginate<Adoption>> {
    return this.adoptionsService.findAll(identifier, shelterId, pagination, status);
  }

  /**
   * Get an adoption request
   */
  @Get(':adoptionId')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<Adoption> {
    return this.adoptionsService.findOne(identifier, shelterId, adoptionId);
  }

  /**
   * Approve a pending adoption request
   */
  @Post(':adoptionId/approve')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  @ApiResponse({ status: 409, type: HttpError })
  public async approve(
    @User() identifier: Identifier,
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
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  @ApiResponse({ status: 400, type: HttpError })
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  @ApiResponse({ status: 409, type: HttpError })
  public async reject(
    @User() identifier: Identifier,
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
  @ApiResponse({ status: 401, type: HttpError })
  @ApiResponse({ status: 403, type: HttpError })
  @ApiResponse({ status: 404, type: HttpError })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<void> {
    await this.adoptionsService.remove(identifier, shelterId, adoptionId);
  }
}
