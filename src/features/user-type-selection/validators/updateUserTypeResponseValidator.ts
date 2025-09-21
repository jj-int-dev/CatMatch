import * as z from 'zod';

export const updateUserTypeResponseValidator = z.object({
  userType: z.literal(['Rehomer', 'Adopter'])
});
