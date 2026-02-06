import * as z from 'zod';

export const getUserProfilePictureValidator = z.object({
  avatarUrl: z.url().nullable()
});
