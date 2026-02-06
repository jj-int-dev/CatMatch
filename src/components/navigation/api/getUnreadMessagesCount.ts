import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';
import { getUnreadMessagesCountValidator } from '../validators/getUnreadMessagesCountValidator';

/**
 * Get the number of unread messages a user has
 * @param userId The ID of user that has unread messages
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @returns The number of unread messages the user has
 */
export async function getUnreadMessagesCount(
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<number> {
  try {
    const response = await axiosMessagesClient.get(`${userId}/unread-count`, {
      headers: getTokenHeaders(accessToken!, refreshToken!)
    });
    const { success, data } = getUnreadMessagesCountValidator.safeParse(
      response.data
    );

    if (success && data) return data.unreadCount;

    return Promise.reject(
      new Error(i18next.t('get_unread_messages_count_error'))
    );
  } catch (_error) {
    return Promise.reject(
      new Error(i18next.t('get_unread_messages_count_error'))
    );
  }
}
