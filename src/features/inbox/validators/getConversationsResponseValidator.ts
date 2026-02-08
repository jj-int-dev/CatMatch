import * as z from 'zod';
import { conversationValidator } from '../../../validators/conversationValidator';

export const getConversationsResponseValidator = z.object({
  conversations: z.array(conversationValidator),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(0)
});

export type GetConversationsResponseSchema = z.infer<
  typeof getConversationsResponseValidator
>;
