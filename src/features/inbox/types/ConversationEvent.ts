import type { MessageEventType } from './MessageEventType';
import type { ConversationSchema } from '../../../validators/conversationValidator';

export type ConversationEvent = {
  type: MessageEventType;
  new: ConversationSchema;
  old?: ConversationSchema;
};
