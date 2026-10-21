import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AdoptionStatus } from '../enums/adoption-status.enum';
import { CreateCatDto } from './create-cat.dto';

/**
 * Update Cat DTO
 */
export class UpdateCatDto extends PartialType(CreateCatDto) {
  @IsOptional()
  @IsEnum(AdoptionStatus)
  public status?: AdoptionStatus;
}
