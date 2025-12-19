import * as z from 'zod';

export const getAddressSuggestionsResponseValidator = z.object({
  results: z.array(
    z.object({
      formatted: z.string().min(1),
      lat: z.number(),
      lon: z.number(),
      address_line1: z.string().min(1),
      address_line2: z.string()
    })
  )
});

export type GetAddressSuggestionsResponseSchema = z.infer<
  typeof getAddressSuggestionsResponseValidator
>;
