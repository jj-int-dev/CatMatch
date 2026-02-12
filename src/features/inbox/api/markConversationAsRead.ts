import {
  markAsReadResponseValidator,
  type MarkAsReadResponseSchema
} from '../validators/markAsReadResponseValidator';
import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';

/**
 * Mark all messages in a conversation as read for the current user
 * @param userId The ID of the current user
 * @param conversationId The ID of the conversation
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @returns Success status
 */
export async function markConversationAsRead(
  userId: string,
  conversationId: string,
  accessToken: string,
  refreshToken: string
): Promise<MarkAsReadResponseSchema> {
  try {
    const markAsReadData = await axiosMessagesClient.put(
      `/${userId}/conversations/${conversationId}/read`,
      {},
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );

    const { success, data } = markAsReadResponseValidator.safeParse(
      markAsReadData.data
    );

    if (success) return data;

    return Promise.reject(new Error(i18next.t('mark_conversation_read_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('mark_conversation_read_error')));
  }
}
