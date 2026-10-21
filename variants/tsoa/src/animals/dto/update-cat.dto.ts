import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { CreateCatDto } from './create-cat.dto';

/**
 * Update Cat DTO
 * @tsoaModel
 */
export interface UpdateCatDto extends Partial<CreateCatDto> {
  status?: AdoptionStatus;
}

/**
 * Update Cat DTO
 */
export class UpdateCatDto extends PartialType(CreateCatDto) {
  @IsOptional()
  @IsEnum(AdoptionStatus)
  public status?: AdoptionStatus;
}
