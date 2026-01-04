import * as z from 'zod';

export const getDiscoveryPreferencesResponseValidator = z.object({
  discoveryPreferences: z
    .object({
      minAge: z.number().min(0),
      maxAge: z.number().max(480),
      gender: z.enum(['', 'Male', 'Female']),
      maxDistanceKm: z.number().min(1).max(250),
      neutered: z.boolean(),
      locationDisplayName: z.string().nullable(),
      searchLocLatitude: z.number(),
      searchLocLongitude: z.number()
    })
    .nullish()
});

export type GetDiscoveryPreferencesResponseSchema = z.infer<
  typeof getDiscoveryPreferencesResponseValidator
>;
