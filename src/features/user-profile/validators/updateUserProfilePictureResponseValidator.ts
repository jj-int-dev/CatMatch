import * as z from 'zod';

export const updateUserProfilePictureResponseValidator = z.object({
  avatarUrl: z.string().regex(/^https:\/\/.+/)
});

export type UpdateUserProfilePictureResponseSchema = z.infer<
  typeof updateUserProfilePictureResponseValidator
>;
