import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ErrorCodes } from '../enums/error-codes.enum';

/**
 * Pipe converting a valid id string to a Mongo ObjectId object
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId> {
  public transform(value: string): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new NotFoundException({
        code: ErrorCodes.UNKNOWN_ENTITY,
        message: `Id ${value} has not been found`,
        status: 404,
      });
    }

    return new ObjectId(value);
  }
}
