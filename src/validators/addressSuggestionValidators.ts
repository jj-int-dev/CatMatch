import * as z from 'zod';

export const addressSuggestionValidator = z.object({
  formatted: z.string().min(1, 'Address is required'),
  city: z.string(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
});

export type AddressSuggestionSchema = z.infer<
  typeof addressSuggestionValidator
>;

export const getAddressSuggestionsResponseValidator = z.object({
  results: z.array(addressSuggestionValidator)
});

export type GetAddressSuggestionsResponseSchema = z.infer<
  typeof getAddressSuggestionsResponseValidator
>;
