import * as z from 'zod';

export const getUserProfilePictureResponseValidator = z.object({
  avatarUrl: z
    .string()
    .regex(/^https:\/\/.+/)
    .nullable()
});

export type GetUserProfilePictureResponseSchema = z.infer<
  typeof getUserProfilePictureResponseValidator
>;
