import * as z from 'zod';

export const getAnimalListingsResponseValidator = z.object({
  animals: z.array(
    z.object({
      animalId: z.string().min(1),
      name: z.string().min(1),
      gender: z.enum(['Male', 'Female']),
      ageInWeeks: z.number().min(0),
      neutered: z.boolean(),
      addressDisplayName: z.string().min(1),
      description: z.string().min(1),
      createdAt: z.iso.datetime(),
      animalPhotos: z.array(
        z.object({
          photoUrl: z.url(),
          order: z.number().min(0)
        })
      )
    })
  ),
  pagination: z.object({
    totalResults: z.number().min(0),
    page: z.number().min(1),
    pageSize: z.number().min(0).max(20),
    totalPages: z.number().min(0)
  })
});

export type GetAnimalListingsResponseSchema = z.infer<
  typeof getAnimalListingsResponseValidator
>;
