import * as z from 'zod';

export const updateUserProfileResponseValidator = z.object({
  email: z.email(),
  displayName: z.string().nullable(),
  phoneNumber: z.e164().nullable(),
  gender: z.literal(['Man', 'Woman', '']).nullable(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  userType: z.string().nullable()
});

export type UpdateUserProfileResponseSchema = z.infer<
  typeof updateUserProfileResponseValidator
>;
