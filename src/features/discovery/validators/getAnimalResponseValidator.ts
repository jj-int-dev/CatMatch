import * as z from 'zod';

export const getAnimalResponseValidator = z.object({
  animals: z.array(
    z.object({
      animalId: z.string().min(1),
      name: z.string().min(1),
      gender: z.enum(['Male', 'Female']),
      ageInWeeks: z.number().min(0),
      neutered: z.boolean(),
      description: z.string().min(1),
      animalPhotos: z.array(
        z.object({
          photoUrl: z.url(),
          order: z.number().min(0)
        })
      )
    })
  )
});

export type GetAnimalResponseSchema = z.infer<
  typeof getAnimalResponseValidator
>;
