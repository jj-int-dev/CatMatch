import * as z from 'zod';

export const setTypingStatusResponseValidator = z.object({
  success: z.boolean()
});

export type SetTypingStatusResponseSchema = z.infer<
  typeof setTypingStatusResponseValidator
>;
