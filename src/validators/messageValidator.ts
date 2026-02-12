import * as z from 'zod';

export const messageValidator = z.object({
  messageId: z.string().min(1),
  conversationId: z.string().min(1),
  senderId: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.string().min(1),
  isRead: z.boolean(),
  readAt: z.string().nullish()
});

export type MessageSchema = z.infer<typeof messageValidator>;
