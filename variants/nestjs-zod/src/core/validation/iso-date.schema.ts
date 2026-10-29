import { z } from 'zod';

const timestampToIsoString = (value: unknown): unknown =>
  typeof value === 'number' && Number.isFinite(new Date(value).getTime()) ? new Date(value).toISOString() : value;

/**
 * Date-time string or millisecond timestamp, parsed into a Date
 * (nonoptional: z.preprocess alone is documented as an optional property)
 */
export const isoDate = z
  .preprocess(timestampToIsoString, z.string().meta({ format: 'date-time' }))
  .pipe(z.coerce.date())
  .nonoptional();
