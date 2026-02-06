import * as z from 'zod';

export const getUserTypeValidator = z.object({
  userType: z.literal(['Rehomer', 'Adopter']).nullable()
});
