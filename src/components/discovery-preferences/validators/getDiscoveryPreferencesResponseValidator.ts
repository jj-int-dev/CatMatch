import * as z from 'zod';

export const getDiscoveryPreferencesResponseValidator = z.object({
  discoveryPreferences: z
    .object({
      minAge: z.number().min(0),
      maxAge: z.number().max(480),
      gender: z.literal(['', 'Male', 'Female']),
      maxDistanceKm: z.number().min(1).max(250),
      neutered: z.boolean()
    })
    .nullish()
});

export type GetDiscoveryPreferencesResponseSchema = z.infer<
  typeof getDiscoveryPreferencesResponseValidator
>;
