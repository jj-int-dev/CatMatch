import * as z from 'zod';

export const messageValidator = z.object({
  message_id: z.string().min(1),
  conversation_id: z.string().min(1),
  sender_id: z.string().min(1),
  content: z.string().min(1),
  created_at: z.string().min(1),
  is_read: z.boolean(),
  read_at: z.string().nullable().optional()
});

export type MessageSchema = z.infer<typeof messageValidator>;
