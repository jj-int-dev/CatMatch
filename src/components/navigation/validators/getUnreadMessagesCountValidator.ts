import * as z from 'zod';

export const getUnreadMessagesCountValidator = z.object({
  unreadCount: z.number()
});
