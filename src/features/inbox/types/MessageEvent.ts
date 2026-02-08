import type { MessageEventType } from './MessageEventType';
import type { MessageSchema } from '../../../validators/messageValidator';

export type MessageEvent = {
  type: MessageEventType;
  new: MessageSchema;
  old?: MessageSchema;
};
