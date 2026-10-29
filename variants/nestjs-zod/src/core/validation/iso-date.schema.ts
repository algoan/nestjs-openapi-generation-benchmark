import { z } from 'zod';

/**
 * Date-time string, parsed into a Date
 */
export const isoDate = z.string().meta({ format: 'date-time' }).pipe(z.coerce.date());
