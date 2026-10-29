import { z } from 'zod';

type PartialNullishShape<T extends z.ZodRawShape> = { [K in keyof T]: z.ZodOptional<z.ZodNullable<T[K]>> };

/**
 * Make every field of an object schema optional and nullable, like PartialType does with @IsOptional()
 */
export const partialNullish = <T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.ZodObject<PartialNullishShape<T>> => {
  const entries = Object.entries(schema.shape).map(([key, field]) => [key, (field as z.ZodType).nullish()]);

  return z.object(Object.fromEntries(entries) as PartialNullishShape<T>);
};
