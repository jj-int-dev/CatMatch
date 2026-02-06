import {
  createConversationResponseValidator,
  type CreateConversationResponseSchema
} from '../validators/createConversationResponseValidator';
import { axiosMessagesClient } from '../../../utils/axios-client';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import i18next from '../../../utils/i18n';

/**
 * Create a new conversation
 * @param userId the ID of the potential adopter
 * @param rehomerId The ID of the rehomer (cat owner)
 * @param animalId The ID of the animal being discussed
 * @param accessToken The access token for authentication
 * @param refreshToken The refresh token for authentication
 * @returns The created conversation
 */
export async function createConversation(
  userId: string,
  rehomerId: string,
  animalId: string,
  accessToken: string,
  refreshToken: string
): Promise<CreateConversationResponseSchema> {
  try {
    const conversationData = await axiosMessagesClient.post(
      `${userId}/conversations`,
      { rehomerId, animalId },
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );

    const { success, data } = createConversationResponseValidator.safeParse(
      conversationData.data
    );

    if (success) return data;

    return Promise.reject(new Error(i18next.t('create_conversation_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('create_conversation_error')));
  }
}
