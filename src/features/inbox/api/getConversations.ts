import {
  getConversationsResponseValidator,
  type GetConversationsResponseSchema
} from '../validators/getConversationsResponseValidator';
import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';

/**
 * Get conversations for the current user
 * @param userId ID of the current user
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @param page Page number (default: 1)
 * @param pageSize Number of items per page (default: 20)
 * @returns List of conversations with pagination info
 */
export async function getConversations(
  userId: string,
  accessToken: string,
  refreshToken: string,
  page: number = 1,
  pageSize: number = 20
): Promise<GetConversationsResponseSchema> {
  try {
    const conversationsData = await axiosMessagesClient.get(
      `/${userId}/conversations`,
      {
        headers: getTokenHeaders(accessToken, refreshToken),
        params: { page, pageSize }
      }
    );

    const { success, data } = getConversationsResponseValidator.safeParse(
      conversationsData.data
    );

    if (success) return data;

    return Promise.reject(new Error(i18next.t('get_conversations_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_conversations_error')));
  }
}
