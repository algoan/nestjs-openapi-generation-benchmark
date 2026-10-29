import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model } from 'mongoose';
import { ErrorCodes } from '../core/enums/error-codes.enum';
import { Identifier } from '../core/interfaces/identifier.interface';
import { DataToPaginate, MongoPagination } from '../core/pagination';
import { assertShelterAccess } from '../shelters/shelters.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { CreateDogDto } from './dto/create-dog.dto';
import { SearchAnimalsDto } from './dto/search-animals.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { AdoptionStatus } from './enums/adoption-status.enum';
import { Species } from './enums/species.enum';
import { Animal } from './models/animal.model';
import { Cat, CatDocument } from './models/cat.model';
import { Dog, DogDocument } from './models/dog.model';

const YEAR_IN_MS: number = 365.25 * 24 * 60 * 60 * 1000;

const notFound = (kind: string, id: ObjectId): NotFoundException =>
  new NotFoundException({
    code: ErrorCodes.UNKNOWN_ENTITY,
    message: `${kind} ${id.toHexString()} has not been found`,
    status: 404,
  });

/**
 * Animals Service, handling both cats and dogs
 */
@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    @InjectModel(Dog.name) private readonly dogModel: Model<Dog>,
  ) {}

  public async createCat(identifier: Identifier, shelterId: ObjectId, dto: CreateCatDto): Promise<CatDocument> {
    assertShelterAccess(identifier, shelterId);

    return this.catModel.create({ ...dto, shelterId });
  }

  public async findCats(
    identifier: Identifier,
    shelterId: ObjectId,
    pagination: MongoPagination,
  ): Promise<DataToPaginate<CatDocument>> {
    assertShelterAccess(identifier, shelterId);
    const filter: FilterQuery<Cat> = { ...pagination.filter, shelterId };
    const [resources, totalResources] = await Promise.all([
      this.catModel.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      this.catModel.countDocuments(filter),
    ]);

    return { resources, totalResources };
  }

  public async findCat(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<CatDocument> {
    assertShelterAccess(identifier, shelterId);
    const cat: CatDocument | null = await this.catModel.findOne({ _id: id, shelterId });
    if (cat === null) {
      throw notFound('Cat', id);
    }

    return cat;
  }

  public async updateCat(
    identifier: Identifier,
    shelterId: ObjectId,
    id: ObjectId,
    dto: UpdateCatDto,
  ): Promise<CatDocument> {
    const cat: CatDocument = await this.findCat(identifier, shelterId, id);
    cat.set(dto);

    return cat.save();
  }

  public async removeCat(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<void> {
    const cat: CatDocument = await this.findCat(identifier, shelterId, id);
    await cat.deleteOne();
  }

  public async createDog(identifier: Identifier, shelterId: ObjectId, dto: CreateDogDto): Promise<DogDocument> {
    assertShelterAccess(identifier, shelterId);

    return this.dogModel.create({ ...dto, shelterId });
  }

  public async findDogs(
    identifier: Identifier,
    shelterId: ObjectId,
    pagination: MongoPagination,
  ): Promise<DataToPaginate<DogDocument>> {
    assertShelterAccess(identifier, shelterId);
    const filter: FilterQuery<Dog> = { ...pagination.filter, shelterId };
    const [resources, totalResources] = await Promise.all([
      this.dogModel.find(filter).sort(pagination.sort).skip(pagination.skip).limit(pagination.limit),
      this.dogModel.countDocuments(filter),
    ]);

    return { resources, totalResources };
  }

  public async findDog(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<DogDocument> {
    assertShelterAccess(identifier, shelterId);
    const dog: DogDocument | null = await this.dogModel.findOne({ _id: id, shelterId });
    if (dog === null) {
      throw notFound('Dog', id);
    }

    return dog;
  }

  public async search(
    identifier: Identifier,
    shelterId: ObjectId,
    search: SearchAnimalsDto,
    includeAdopted: boolean,
  ): Promise<(CatDocument | DogDocument)[]> {
    assertShelterAccess(identifier, shelterId);
    const filter: FilterQuery<Animal> = { shelterId };
    if (search.status !== undefined) {
      filter.status = search.status;
    } else if (!includeAdopted) {
      filter.status = { $ne: AdoptionStatus.ADOPTED };
    }
    if (search.name !== undefined) {
      filter.name = { $regex: `^${search.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' };
    }
    if (search.minAge !== undefined) {
      filter.birthDate = { $lte: new Date(Date.now() - search.minAge * YEAR_IN_MS) };
    }

    const [cats, dogs] = await Promise.all([
      search.species === undefined || search.species === Species.CAT ? this.catModel.find(filter) : [],
      search.species === undefined || search.species === Species.DOG ? this.dogModel.find(filter) : [],
    ]);

    return [...cats, ...dogs];
  }

  public async findAnimal(identifier: Identifier, shelterId: ObjectId, id: ObjectId): Promise<CatDocument | DogDocument> {
    assertShelterAccess(identifier, shelterId);
    const animal: CatDocument | DogDocument | null =
      (await this.catModel.findOne({ _id: id, shelterId })) ?? (await this.dogModel.findOne({ _id: id, shelterId }));
    if (animal === null) {
      throw notFound('Animal', id);
    }

    return animal;
  }
}
