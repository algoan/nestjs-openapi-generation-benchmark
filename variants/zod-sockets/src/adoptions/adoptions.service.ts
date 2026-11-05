import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { Identifier } from '../core/interfaces/identifier.interface';
import { DataToPaginate, MongoPagination } from '../core/pagination';
import { PUBSUB_CLIENT } from '../core/pubsub/pubsub.constants';
import { AdoptionDecidedEvent } from '../events/adoption-decided.event';
import { AdoptionRequestedEvent } from '../events/adoption-requested.event';
import { EventName } from '../events/enums/event-name.enum';
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
  constructor(
    @InjectModel(Adoption.name) private readonly adoptionModel: Model<Adoption>,
    @Inject(PUBSUB_CLIENT) private readonly pubSubClient: ClientProxy,
  ) {}

  public async create(identifier: Identifier, shelterId: ObjectId, dto: CreateAdoptionDto): Promise<AdoptionReceipt> {
    assertShelterAccess(identifier, shelterId);
    const adoption: AdoptionDocument = await this.adoptionModel.create({
      ...dto,
      animalId: new ObjectId(dto.animalId),
      shelterId,
    });
    const event: AdoptionRequestedEvent = {
      adoptionId: adoption._id.toHexString(),
      shelterId: shelterId.toHexString(),
      animalId: dto.animalId,
      species: adoption.species,
      adopter: adoption.adopter,
      fee: adoption.fee,
    };
    this.pubSubClient.emit(EventName.ADOPTION_REQUESTED, event);

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
    const decidedAt: Date = new Date();
    adoption.set({ status, rejectionReason, decidedAt });
    const saved: AdoptionDocument = await adoption.save();
    const event: AdoptionDecidedEvent = {
      adoptionId: adoption._id.toHexString(),
      shelterId: adoption.shelterId.toHexString(),
      status,
      rejectionReason,
      decidedAt,
    };
    this.pubSubClient.emit(EventName.ADOPTION_DECIDED, event);

    return saved;
  }

  public async remove(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<void> {
    const adoption: AdoptionDocument = await this.findOne(identifier, shelterId, id);
    await adoption.deleteOne();
  }
}
