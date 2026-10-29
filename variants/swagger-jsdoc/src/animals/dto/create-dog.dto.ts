import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { DogSize } from '../enums/dog-size.enum';
import { CreateAnimalDto } from './create-animal.dto';

/**
 * Create Dog DTO
 * @openapi
 * components:
 *   schemas:
 *     CreateDogDto:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateAnimalDto'
 *         - type: object
 *           required: [breed, size]
 *           properties:
 *             breed:
 *               type: string
 *             size:
 *               $ref: '#/components/schemas/DogSize'
 *             goodWithKids:
 *               type: boolean
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
