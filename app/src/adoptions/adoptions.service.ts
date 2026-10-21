import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { Identifier } from '../core/interfaces/identifier.interface';
import { DataToPaginate, MongoPagination } from '../core/pagination';
import { assertShelterAccess } from '../shelters/shelters.service';
import { CreateAdoptionDto } from './dto/create-adoption.dto';
import { AdoptionRequestStatus } from './enums/adoption-request-status.enum';
import { AdoptionReceipt } from './interfaces/adoption-receipt.interface';
import { Adoption, AdoptionDocument } from './models/adoption.model';

const DECISION_DELAY_IN_MS: number = 7 * 24 * 60 * 60 * 1000;

/**
 * Adoptions Service
 */
@Injectable()
export class AdoptionsService {
  constructor(@InjectModel(Adoption.name) private readonly adoptionModel: Model<Adoption>) {}

  public async create(identifier: Identifier, shelterId: ObjectId, dto: CreateAdoptionDto): Promise<AdoptionReceipt> {
    assertShelterAccess(identifier, shelterId);
    const adoption: AdoptionDocument = await this.adoptionModel.create({
      ...dto,
      animalId: new ObjectId(dto.animalId),
      shelterId,
    });

    return {
      adoptionId: adoption._id.toHexString(),
      status: adoption.status,
      expectedDecisionDate: new Date(adoption.createdAt.getTime() + DECISION_DELAY_IN_MS),
    };
  }

  public async findAll(
    identifier: Identifier,
    shelterId: ObjectId,
    pagination: MongoPagination,
    status?: AdoptionRequestStatus,
  ): Promise<DataToPaginate<AdoptionDocument>> {
    assertShelterAccess(identifier, shelterId);
    const filter: FilterQuery<Adoption> = { ...pagination.filter, shelterId, ...(status ? { status } : {}) };
    const [resources, totalResources] = await Promise.all([
      this.adoptionModel.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      this.adoptionModel.countDocuments(filter),
    ]);

    return { resources, totalResources };
  }

  public async findOne(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<AdoptionDocument> {
    assertShelterAccess(identifier, shelterId);
    const adoption: AdoptionDocument | null = await this.adoptionModel.findOne({ _id: id, shelterId });
    if (adoption === null) {
      throw new NotFoundException({
        code: ErrorCodes.UNKNOWN_ENTITY,
        message: `Adoption ${id.toHexString()} has not been found`,
        status: 404,
      });
    }

    return adoption;
  }

  public async decide(
    adoption: AdoptionDocument,
    status: AdoptionRequestStatus,
    rejectionReason?: string,
  ): Promise<AdoptionDocument> {
    adoption.set({ status, rejectionReason, decidedAt: new Date() });

    return adoption.save();
  }

  public async remove(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<void> {
    const adoption: AdoptionDocument = await this.findOne(identifier, shelterId, id);
    await adoption.deleteOne();
  }
}
