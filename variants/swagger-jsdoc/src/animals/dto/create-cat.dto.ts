import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CoatPattern } from '../enums/coat-pattern.enum';
import { CreateAnimalDto } from './create-animal.dto';

/**
 * Create Cat DTO
 * @openapi
 * components:
 *   schemas:
 *     CreateCatDto:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateAnimalDto'
 *         - type: object
 *           required: [indoor]
 *           properties:
 *             indoor:
 *               type: boolean
 *               description: Whether the cat must live indoors
 *             coatPattern:
 *               $ref: '#/components/schemas/CoatPattern'
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
