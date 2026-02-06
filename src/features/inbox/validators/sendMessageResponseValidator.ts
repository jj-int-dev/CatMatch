import * as z from 'zod';
import { messageValidator } from './messageValidator';

export const sendMessageResponseValidator = z.object({
  message: messageValidator
});

export type SendMessageResponseSchema = z.infer<
  typeof sendMessageResponseValidator
>;
