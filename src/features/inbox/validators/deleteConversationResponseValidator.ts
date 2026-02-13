import * as z from 'zod';

export const deleteConversationResponseValidator = z.object({
  success: z.boolean(),
  hardDeleted: z.boolean()
});

export type DeleteConversationResponseSchema = z.infer<
  typeof deleteConversationResponseValidator
>;
