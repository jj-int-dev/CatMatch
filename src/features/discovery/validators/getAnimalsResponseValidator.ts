import * as z from 'zod';

export const getAnimalsResponseValidator = z.object({
  animals: z.array(
    z.object({
      animalId: z.string().min(1),
      name: z.string().min(1),
      gender: z.enum(['Male', 'Female']),
      ageInWeeks: z.number().min(0),
      neutered: z.boolean(),
      description: z.string().min(1),
      rehomerId: z.string().min(1),
      distanceMeters: z.number().min(0),
      animalPhotos: z.array(
        z.object({
          photoUrl: z.url(),
          order: z.number().min(0)
        })
      )
    })
  ),
  locationDisplay: z.string().nullable(),
  pagination: z.object({
    totalResults: z.number().min(0),
    page: z.number().min(1),
    pageSize: z.number().min(0).max(20),
    totalPages: z.number().min(0)
  })
});

export type GetAnimalsResponseSchema = z.infer<
  typeof getAnimalsResponseValidator
>;
