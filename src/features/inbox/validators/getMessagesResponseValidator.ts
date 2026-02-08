import * as z from 'zod';
import { messageValidator } from '../../../validators/messageValidator';

export const getMessagesResponseValidator = z.object({
  messages: z.array(messageValidator),
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(0)
});

export type GetMessagesResponseSchema = z.infer<
  typeof getMessagesResponseValidator
>;
