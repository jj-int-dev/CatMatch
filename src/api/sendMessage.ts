import {
  sendMessageResponseValidator,
  type SendMessageResponseSchema
} from '../validators/sendMessageResponseValidator';
import { axiosMessagesClient } from '../utils/axios-client';
import getTokenHeaders from '../utils/getTokenHeaders';
import i18next from '../utils/i18n';

/**
 * Send a message in a conversation
 * @param userId The ID of the message sender
 * @param conversationId The ID of the conversation
 * @param content The message content
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @returns The sent message
 */
export async function sendMessage(
  userId: string,
  conversationId: string,
  content: string,
  accessToken: string,
  refreshToken: string
): Promise<SendMessageResponseSchema> {
  try {
    const messageData = await axiosMessagesClient.post(
      `${userId}/conversations/${conversationId}/messages`,
      { content },
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );

    const { success, data } = sendMessageResponseValidator.safeParse(
      messageData.data
    );

    if (success) return data;

    return Promise.reject(new Error(i18next.t('send_message_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('send_message_error')));
  }
}
