import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DogSize } from '../enums/dog-size.enum';
import { CreateAnimalDto } from './create-animal.dto';

/**
 * Create Dog DTO
 */
export class CreateDogDto extends CreateAnimalDto {
  @IsString()
  public breed: string;

  @IsEnum(DogSize)
  public size: DogSize;

  @IsOptional()
  @IsBoolean()
  public goodWithKids?: boolean;
}
