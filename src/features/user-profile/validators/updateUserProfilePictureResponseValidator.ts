import * as z from 'zod';

export const updateUserProfilePictureResponseValidator = z.object({
  avatarUrl: z.url()
});

export type UpdateUserProfilePictureResponseSchema = z.infer<
  typeof updateUserProfilePictureResponseValidator
>;
