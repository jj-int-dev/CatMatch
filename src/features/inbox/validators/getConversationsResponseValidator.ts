import * as z from 'zod';

export const conversationValidator = z.object({
  conversationId: z.string().min(1),
  adopterId: z.string().min(1),
  rehomerId: z.string().min(1),
  animalId: z.string().min(1).nullable(),
  createdAt: z.string().min(1),
  lastMessageAt: z.string().min(1).nullable(),
  adopterLastActiveAt: z.string().min(1).nullable(),
  rehomerLastActiveAt: z.string().min(1).nullable(),
  adopterLastReadAt: z.string().min(1).nullable(),
  rehomerLastReadAt: z.string().min(1).nullable(),
  adopterIsTyping: z.boolean().default(false),
  rehomerIsTyping: z.boolean().default(false),
  adopterLastTypingAt: z.string().min(1).nullable(),
  rehomerLastTypingAt: z.string().min(1).nullable(),
  otherUserName: z.string().nullable(),
  otherUserProfilePicture: z.string().nullable(),
  unreadCount: z.number().int().min(0).optional(),
  animalName: z.string().nullable(),
  animalPhoto: z.string().nullable()
});

export type ConversationSchema = z.infer<typeof conversationValidator>;

export const getConversationsResponseValidator = z.object({
  conversations: z.array(conversationValidator),
  pagination: z.object({
    totalPages: z.number().int().min(1),
    totalResults: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(0)
  })
});

export type GetConversationsResponseSchema = z.infer<
  typeof getConversationsResponseValidator
>;
