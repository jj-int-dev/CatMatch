import * as z from 'zod';

export const getAddressSuggestionsResponseValidator = z.object({
  formatted: z.string().min(1)
});
