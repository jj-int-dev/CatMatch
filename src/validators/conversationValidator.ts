import * as z from 'zod';

export const conversationValidator = z.object({
  conversation_id: z.string().min(1),
  adopter_id: z.string().min(1),
  rehomer_id: z.string().min(1),
  animal_id: z.string().min(1).nullable(),
  created_at: z.string().min(1),
  last_message_at: z.string().min(1).nullable(),
  adopter_last_active_at: z.string().min(1).nullable(),
  rehomer_last_active_at: z.string().min(1).nullable(),
  adopter_last_read_at: z.string().min(1).nullable(),
  rehomer_last_read_at: z.string().min(1).nullable(),
  adopter_is_typing: z.boolean().default(false),
  rehomer_is_typing: z.boolean().default(false),
  adopter_last_typing_at: z.string().min(1).nullable(),
  rehomer_last_typing_at: z.string().min(1).nullable(),
  otherUserName: z.string().nullable(),
  otherUserProfilePicture: z.string().nullable(),
  unreadCount: z.number().int().min(0).optional(),
  animalName: z.string().nullable(),
  animalPhoto: z.string().nullable()
});

export type ConversationSchema = z.infer<typeof conversationValidator>;
