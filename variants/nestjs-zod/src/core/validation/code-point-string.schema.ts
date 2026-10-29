import { length } from 'class-validator';
import { z } from 'zod';

/**
 * String whose length is counted in code points, like @Length / @MinLength / @MaxLength (zod counts UTF-16 units)
 */
export const codePointString = ({ min = 0, max }: { min?: number; max?: number }) =>
  z
    .string()
    .refine((value: string) => length(value, min, max))
    .meta({ minLength: min > 0 ? min : undefined, maxLength: max });
