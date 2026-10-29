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
   * @openapi
   * /shelters/{shelterId}/adoptions:
   *   post:
   *     summary: File an adoption request
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: x-request-id
   *         in: header
   *         description: Correlation id, echoed in the logs
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAdoptionDto'
   *     responses:
   *       '201':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AdoptionReceipt'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Post()
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
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
   * @openapi
   * /shelters/{shelterId}/adoptions:
   *   get:
   *     summary: List the adoption requests of a shelter
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - $ref: '#/components/parameters/page'
   *       - $ref: '#/components/parameters/limit'
   *       - $ref: '#/components/parameters/filter'
   *       - $ref: '#/components/parameters/sort'
   *       - name: status
   *         in: query
   *         description: Only return the requests in this status
   *         schema:
   *           $ref: '#/components/schemas/AdoptionRequestStatus'
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
   *                     $ref: '#/components/schemas/Adoption'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationLinks'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get()
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
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
   * @openapi
   * /shelters/{shelterId}/adoptions/{adoptionId}:
   *   get:
   *     summary: Get an adoption request
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: adoptionId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Adoption'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Get(':adoptionId')
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_READER] })
  public async findOne(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ) {
    return this.adoptionsService.findOne(identifier, shelterId, adoptionId);
  }

  /**
   * Approve a pending adoption request
   * @openapi
   * /shelters/{shelterId}/adoptions/{adoptionId}/approve:
   *   post:
   *     summary: Approve a pending adoption request
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: adoptionId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Adoption'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '409':
   *         $ref: '#/components/responses/Conflict'
   */
  @Post(':adoptionId/approve')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
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
   * @openapi
   * /shelters/{shelterId}/adoptions/{adoptionId}/reject:
   *   post:
   *     summary: Reject a pending adoption request
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: adoptionId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RejectAdoptionDto'
   *     responses:
   *       '200':
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Adoption'
   *       '400':
   *         $ref: '#/components/responses/BadRequest'
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   *       '409':
   *         $ref: '#/components/responses/Conflict'
   */
  @Post(':adoptionId/reject')
  @HttpCode(HttpStatus.OK)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_REVIEWER] })
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
   * @openapi
   * /shelters/{shelterId}/adoptions/{adoptionId}:
   *   delete:
   *     summary: Cancel an adoption request
   *     parameters:
   *       - $ref: '#/components/parameters/shelterId'
   *       - name: adoptionId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       '204':
   *         description: No content
   *       '401':
   *         $ref: '#/components/responses/Unauthorized'
   *       '403':
   *         $ref: '#/components/responses/Forbidden'
   *       '404':
   *         $ref: '#/components/responses/NotFound'
   */
  @Delete(':adoptionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles({ roles: [AdoptionAuthRoles.ADOPTION_CREATOR] })
  public async remove(
    @User() identifier: Identifier,
    @Param('shelterId', new ParseObjectIdPipe()) shelterId: ObjectId,
    @Param('adoptionId', new ParseObjectIdPipe()) adoptionId: ObjectId,
  ): Promise<void> {
    await this.adoptionsService.remove(identifier, shelterId, adoptionId);
  }
}
