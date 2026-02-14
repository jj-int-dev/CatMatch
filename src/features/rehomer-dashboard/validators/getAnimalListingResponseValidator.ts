import * as z from 'zod';

export const getAnimalListingResponseValidator = z
  .object({
    animalId: z.string().min(1),
    name: z.string().min(1),
    gender: z.enum(['Male', 'Female']),
    ageInWeeks: z.number().min(0),
    neutered: z.boolean(),
    addressDisplayName: z.string().min(1),
    description: z.string().min(1),
    createdAt: z.string(), // DB timestamp format: 2026-02-12 01:38:25.815112+00
    addressLatitude: z.number(),
    addressLongitude: z.number(),
    animalPhotos: z.array(
      z.object({
        photoUrl: z.url(),
        order: z.number().min(0)
      })
    )
  })
  .nullish();

export type GetAnimalListingResponseSchema = z.infer<
  typeof getAnimalListingResponseValidator
>;
