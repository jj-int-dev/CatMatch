import * as z from 'zod';

export const markAsReadResponseValidator = z.object({
  success: z.boolean()
});

export type MarkAsReadResponseSchema = z.infer<
  typeof markAsReadResponseValidator
>;
