import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ShelterStatus } from '../enums/shelter-status.enum';
import { CreateShelterDto } from './create-shelter.dto';

/**
 * Update Shelter DTO: every field but the country can be updated
 */
export class UpdateShelterDto extends PartialType(OmitType(CreateShelterDto, ['country'] as const)) {
  @IsOptional()
  @IsEnum(ShelterStatus)
  public status?: ShelterStatus;
}
