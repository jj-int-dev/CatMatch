import * as z from 'zod';
import { conversationValidator } from './conversationValidator';

export const createConversationResponseValidator = z.object({
  conversation: conversationValidator
});

export type CreateConversationResponseSchema = z.infer<
  typeof createConversationResponseValidator
>;
