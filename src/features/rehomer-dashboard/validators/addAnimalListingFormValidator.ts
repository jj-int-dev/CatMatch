import * as z from 'zod';
import i18next from '../../../utils/i18n';

export const createAddAnimalListingFormValidator = () =>
  z.object({
    name: z.string().min(1, 'Cat name is required'),
    age: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number()
        .int()
        .positive('Age must be a positive number')
        .min(1, 'Age is required')
    ),
    gender: z.enum(['male', 'female']),
    description: z.string().min(1, 'Description is required'),
    neutered: z.enum(['yes', 'no', 'unknown']).optional(),
    location: z.object({
      address: z.string().min(1, 'Address is required'),
      city: z.string().optional(),
      state: z.string().optional(),
      coordinates: z
        .object({
          lat: z.number().optional(),
          lng: z.number().optional()
        })
        .optional()
    })
  });

export type AddAnimalListingFormSchema = z.infer<
  ReturnType<typeof createAddAnimalListingFormValidator>
>;
