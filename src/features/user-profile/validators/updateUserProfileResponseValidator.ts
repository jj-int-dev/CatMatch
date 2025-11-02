import * as z from 'zod';

export const updateUserProfileResponseValidator = z.object({
  email: z.email(),
  displayName: z.string().min(1),
  phoneNumber: z.union([z.e164(), z.literal('')]), //empty string or E.164 format phone number
  gender: z.literal(['Man', 'Woman', '']),
  dateOfBirth: z.union([
    z.literal(''),
    z.iso.date().refine((date) => new Date(date) < new Date())
  ]),
  bio: z.string(),
  userType: z.literal(['Rehomer', 'Adopter']).nullable()
});

export type UpdateUserProfileResponseSchema = z.infer<
  typeof updateUserProfileResponseValidator
>;
