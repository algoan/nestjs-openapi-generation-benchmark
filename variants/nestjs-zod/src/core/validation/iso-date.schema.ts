import { z } from 'zod';

const toIsoString = (value: unknown): unknown => {
  if (typeof value !== 'number' && typeof value !== 'boolean') {
    return value;
  }
  const date: Date = new Date(Number(value));

  return Number.isFinite(date.getTime()) ? date.toISOString() : value;
};

/**
 * Anything @Type(() => Date) + @IsDate() accepts (strings, timestamps, booleans…), parsed into a Date
 * (nonoptional: z.preprocess alone is documented as an optional property)
 */
export const isoDate = z
  .preprocess(toIsoString, z.string().meta({ format: 'date-time' }))
  .pipe(z.coerce.date())
  .nonoptional();
