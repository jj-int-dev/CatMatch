import {
  getMessagesResponseValidator,
  type GetMessagesResponseSchema
} from '../validators/getMessagesResponseValidator';
import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';

/**
 * Get messages in a conversation
 * @param userId The ID of user that the conversation's messages are being fetched for
 * @param conversationId The ID of the conversation
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @param page Page number (default: 1)
 * @param pageSize Number of items per page (default: 20)
 * @returns List of messages with pagination info
 */
export async function getMessages(
  userId: string,
  conversationId: string,
  accessToken: string,
  refreshToken: string,
  page: number = 1,
  pageSize: number = 20
): Promise<GetMessagesResponseSchema> {
  try {
    const messagesData = await axiosMessagesClient.get(
      `${userId}/conversations/${conversationId}/messages`,
      {
        headers: getTokenHeaders(accessToken, refreshToken),
        params: { page, pageSize }
      }
    );

    const { success, data } = getMessagesResponseValidator.safeParse(
      messagesData.data
    );

    if (success) return data;

    return Promise.reject(new Error(i18next.t('get_messages_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_messages_error')));
  }
}
