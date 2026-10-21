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
import { Identifier } from '../core/interfaces/identifier.interface';
import { Log } from '../core/logging/log.decorator';
import { ApiPaginated, DataToPaginate, MongoPagination, PaginationBodyInterceptor, PaginationParams } from '../core/pagination';
import { ParseObjectIdPipe } from '../core/pipes/parse-object-id.pipe';
import { AdoptionsService } from './adoptions.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { RejectAdoptionDto } from './dto/reject-adoption.dto';
import { AdoptionAuthRoles } from './enums/adoption-auth-roles.enum';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionReceipt } from './interfaces/adoption-receipt.interface';
import { Adoption, AdoptionDocument } from './models/adoption.model';
import { ApiErrors } from '../core/swagger/api-errors.decorator';

/**
 * Adoptions Controller
 */
@Controller('shelters/:shelterId/adoptions')
export class AdoptionsController {
  private readonly logger: Logger = new Logger(AdoptionsController.name);

  constructor(private readonly adoptionsService: AdoptionsService) {}

  /**
   * File an adoption request
   */
  @Post()
  @ApiErrors(400, 404)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  @Log({ mask: ['adopter.email', 'adopter.phone'] })
  public async create(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Body() createAdoptionDto: CreateAdoptionDto,
    // @nestia/sdk only documents the headers given as an object
    @Headers()
    headers: {
      /**
       * Correlation id, echoed in the logs
       */
      'x-request-id'?: string;
    },
  ): Promise<AdoptionReceipt> {
    this.logger.log(`Adoption request ${headers['x-request-id'] ?? '-'}`);

    return this.adoptionsService.create(identifier, new ObjectId(shelterId), createAdoptionDto);
  }

  /**
   * List the adoption requests of a shelter
   * @param status Only return the requests in this status
   */
  @Get()
  @ApiErrors(400, 404)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  @UseInterceptors(new PaginationBodyInterceptor({ perPageName: 'limit' }))
  @ApiPaginated({ perPageName: 'limit' })
  public async findAll(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @PaginationParams({ perPageName: 'limit' }) pagination: MongoPagination,
    @Query('status', new ParseEnumPipe(AdoptionRequestStatus, { optional: true })) status?: AdoptionRequestStatus,
  ): Promise<DataToPaginate<Adoption>> {
    return this.adoptionsService.findAll(identifier, new ObjectId(shelterId), pagination, status);
  }

  /**
   * Get an adoption request
   */
  @Get(':adoptionId')
  @ApiErrors(404)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: string,
  ): Promise<Adoption> {
    return this.adoptionsService.findOne(identifier, new ObjectId(shelterId), new ObjectId(adoptionId));
  }

  /**
   * Approve a pending adoption request
   */
  @Post(':adoptionId/approve')
  @ApiErrors(404, 409)
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async approve(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: string,
  ): Promise<Adoption> {
    const adoption: AdoptionDocument = await this.adoptionsService.findOne(identifier, new ObjectId(shelterId), new ObjectId(adoptionId));
    if (adoption.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictException({
        code: ErrorCodes.CONFLICT,
        message: `Adoption ${adoption._id.toHexString()} has already been decided`,
        status: 409,
      });
    }

    return this.adoptionsService.decide(adoption, AdoptionRequestStatus.APPROVED);
  }

  /**
   * Reject a pending adoption request
   */
  @Post(':adoptionId/reject')
  @ApiErrors(400, 404, 409)
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
  public async reject(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: string,
    @Body() rejectAdoptionDto: RejectAdoptionDto,
  ): Promise<Adoption> {
    const adoption: AdoptionDocument = await this.adoptionsService.findOne(identifier, new ObjectId(shelterId), new ObjectId(adoptionId));
    if (adoption.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictException({
        code: ErrorCodes.CONFLICT,
        message: `Adoption ${adoption._id.toHexString()} has already been decided`,
        status: 409,
      });
    }

    return this.adoptionsService.decide(adoption, AdoptionRequestStatus.REJECTED, rejectAdoptionDto.reason);
  }

  /**
   * Cancel an adoption request
   */
  @Delete(':adoptionId')
  @ApiErrors(404)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: string,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: string,
  ): Promise<void> {
    await this.adoptionsService.remove(identifier, new ObjectId(shelterId), new ObjectId(adoptionId));
  }
}
