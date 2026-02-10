import * as z from 'zod';

export const getUserProfileResponseValidator = z.object({
  email: z.email(),
  displayName: z.string().nullable(),
  dateOfBirth: z
    .string()
    .refine(
      (date: string) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
      },
      {
        message: 'Date of birth must be before today'
      }
    )
    .nullable(),
  phoneNumber: z.e164().nullable(),
  gender: z.enum(['Man', 'Woman', '']).nullable(),
  bio: z.string().nullable(),
  userType: z.string().nullable()
});

export type GetUserProfileResponseSchema = z.infer<
  typeof getUserProfileResponseValidator
>;
