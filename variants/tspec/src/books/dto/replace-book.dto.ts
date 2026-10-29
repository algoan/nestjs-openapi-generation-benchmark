import { OmitType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

/**
 * Replace Book DTO: the ISBN comes from the path
 */
export class ReplaceBookDto extends OmitType(CreateBookDto, ['isbn'] as const) {}
