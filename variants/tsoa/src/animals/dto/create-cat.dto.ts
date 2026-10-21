import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CoatPattern } from '../enums/coat-pattern.enum';
import { CreateAnimalDto } from './create-animal.dto';

/**
 * Create Cat DTO
 */
export class CreateCatDto extends CreateAnimalDto {
  /**
   * Whether the cat must live indoors
   */
  @IsBoolean()
  public indoor: boolean;

  @IsOptional()
  @IsEnum(CoatPattern)
  public coatPattern?: CoatPattern;
}
