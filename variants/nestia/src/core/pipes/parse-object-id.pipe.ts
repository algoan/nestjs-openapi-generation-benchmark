import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ErrorCodes } from '../enums/error-codes.enum';

/**
 * Pipe rejecting the id strings that are not valid Mongo ObjectIds
 * (returns the string: @nestia/sdk only accepts atomic path parameter types)
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  public transform(value: string): string {
    if (!ObjectId.isValid(value)) {
      throw new NotFoundException({
        code: ErrorCodes.UNKNOWN_ENTITY,
        message: `Id ${value} has not been found`,
        status: 404,
      });
    }

    return value;
  }
}
