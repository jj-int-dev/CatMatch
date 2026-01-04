import * as z from 'zod';

export const getUserProfilePictureAndTypeResponseValidator = z.object({
  avatarUrl: z
    .string()
    .regex(/^https:\/\/.+/)
    .nullable(),
  userType: z.enum(['Rehomer', 'Adopter']).nullable()
});
