import * as z from 'zod';

export const createAnimalListingResponseValidator = z.object({
  animalId: z.string().min(1)
});

export type CreateAnimalListingResponseSchema = z.infer<
  typeof createAnimalListingResponseValidator
>;
