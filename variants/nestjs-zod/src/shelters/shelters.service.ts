import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { Identifier } from '../core/interfaces/identifier.interface';
import { DataToPaginate, MongoPagination } from '../core/pagination';
import { CreateShelterDto } from './dto/create-shelter.dto';
import { UpdateShelterDto } from './dto/update-shelter.dto';
import { ShelterStats } from './interfaces/shelter-stats.interface';
import { Shelter, ShelterDocument } from './models/shelter.model';

/**
 * Shelters Service
 */
@Injectable()
export class SheltersService {
  constructor(@InjectModel(Shelter.name) private readonly shelterModel: Model<Shelter>) {}

  public async create(_identifier: Identifier, dto: CreateShelterDto): Promise<ShelterDocument> {
    const shelter: ShelterDocument = await this.shelterModel.create(dto);

    return shelter;
  }

  public async findAll(identifier: Identifier, pagination: MongoPagination): Promise<DataToPaginate<ShelterDocument>> {
    const filter: Record<string, unknown> = {
      ...pagination.filter,
      _id: { $in: identifier.shelterIds.map((id: string): ObjectId => new ObjectId(id)) },
      isDeleted: false,
    };
    const [resources, totalResources] = await Promise.all([
      this.shelterModel.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      this.shelterModel.countDocuments(filter),
    ]);

    return { resources, totalResources };
  }

  public async findOne(identifier: Identifier, id: ObjectId): Promise<ShelterDocument> {
    assertShelterAccess(identifier, id);
    const shelter: ShelterDocument | null = await this.shelterModel.findOne({ _id: id, isDeleted: false });

    if (shelter === null) {
      throw new NotFoundException({
        code: ErrorCodes.UNKNOWN_ENTITY,
        message: `Shelter ${id.toHexString()} has not been found`,
        status: 404,
      });
    }

    return shelter;
  }

  public async update(identifier: Identifier, id: ObjectId, dto: UpdateShelterDto): Promise<ShelterDocument> {
    const shelter: ShelterDocument = await this.findOne(identifier, id);
    shelter.set(dto);

    return shelter.save();
  }

  public async remove(identifier: Identifier, id: ObjectId): Promise<void> {
    const shelter: ShelterDocument = await this.findOne(identifier, id);
    shelter.isDeleted = true;
    await shelter.save();
  }

  public async getStats(identifier: Identifier, id: ObjectId, year: number): Promise<ShelterStats> {
    const shelter: ShelterDocument = await this.findOne(identifier, id);
    const hostedAnimals: number = shelter.tags.length;

    return {
      shelterId: shelter._id.toHexString(),
      year,
      hostedAnimals,
      adoptions: { approved: 0, rejected: 0, pending: 0 },
      occupancyRate: shelter.capacity === 0 ? 0 : Math.min(hostedAnimals / shelter.capacity, 1),
    };
  }
}

/**
 * Throw a 403 when the caller cannot access a shelter
 */
export const assertShelterAccess = (identifier: Identifier, shelterId: ObjectId): void => {
  if (!identifier.shelterIds.includes(shelterId.toHexString())) {
    throw new ForbiddenException({
      code: ErrorCodes.FORBIDDEN,
      message: `Shelter ${shelterId.toHexString()} is not accessible`,
      status: 403,
    });
  }
};
