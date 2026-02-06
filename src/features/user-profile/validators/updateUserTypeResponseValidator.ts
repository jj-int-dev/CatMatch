import * as z from 'zod';

export const updateUserTypeResponseValidator = z.object({
  userType: z.enum(['Rehomer', 'Adopter']),
  deletedUserData: z.boolean()
});

export type UpdateUserTypeResponseSchema = z.infer<
  typeof updateUserTypeResponseValidator
>;
