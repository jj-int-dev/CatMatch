import axios from 'axios';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import {
  deleteConversationResponseValidator,
  type DeleteConversationResponseSchema
} from '../validators/deleteConversationResponseValidator';

/**
 * Deletes a conversation for the authenticated user (WhatsApp-style).
 * Soft deletes for this user, hard deletes if both users have deleted.
 *
 * @param userId - The ID of the user deleting the conversation
 * @param conversationId - The ID of the conversation to delete
 * @param accessToken - The user's access token
 * @param refreshToken - The user's refresh token
 * @returns Promise resolving to the delete response
 */
export async function deleteConversation(
  userId: string,
  conversationId: string,
  accessToken: string,
  refreshToken: string
): Promise<DeleteConversationResponseSchema> {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_MESSAGES_MICROSERVICE_BASE_URL}/${userId}/conversations/${conversationId}`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );

    const { success, data } = deleteConversationResponseValidator.safeParse(
      response.data
    );

    if (success && data.success) return data;

    return Promise.reject(new Error(i18next.t('delete_convo_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('delete_convo_error')));
  }
}
