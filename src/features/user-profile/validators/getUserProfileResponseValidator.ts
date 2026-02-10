import * as z from 'zod';

export const getUserProfileResponseValidator = z.object({
  email: z.email(),
  displayName: z.string().nullable(),
  dateOfBirth: z.coerce
    .date()
    .refine((date) => new Date(date) < new Date())
    .nullable(),
  phoneNumber: z.e164().nullable(),
  gender: z.enum(['Man', 'Woman', '']).nullable(),
  bio: z.string().nullable(),
  userType: z.string().nullable()
});

export type GetUserProfileResponseSchema = z.infer<
  typeof getUserProfileResponseValidator
>;
