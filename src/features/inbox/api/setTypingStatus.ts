import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';

/**
 * Set typing status in a conversation
 * @param userId The ID of user that is typing
 * @param conversationId The ID of the conversation
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @param isTyping Whether the user is typing or not
 * @returns Success response
 */
export async function setTypingStatus(
  userId: string,
  conversationId: string,
  accessToken: string,
  refreshToken: string,
  isTyping: boolean
): Promise<{ success: boolean }> {
  try {
    const response = await axiosMessagesClient.put(
      `${userId}/conversations/${conversationId}/typing`,
      { isTyping },
      {
        headers: getTokenHeaders(accessToken, refreshToken)
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to set typing status:', error);
    return Promise.reject(new Error(i18next.t('set_typing_status_error')));
  }
}
