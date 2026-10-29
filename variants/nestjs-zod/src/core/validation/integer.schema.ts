import { z } from 'zod';

/**
 * Integer like @IsInt(): z.int() also rejects unsafe integers and documents the safe-integer bounds
 */
export const integer = () => z.number().refine(Number.isInteger).meta({ type: 'integer' });
