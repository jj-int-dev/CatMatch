import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import { createConversation } from '../../../api/createConversation';
import type { CreateConversationRequest } from '../types/CreateConversationRequest';
import type { CreateConversationResponseSchema } from '../../../validators/createConversationResponseValidator';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      conversationData: CreateConversationRequest
    ): Promise<CreateConversationResponseSchema> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      return await createConversation(
        userId,
        conversationData.rehomerId,
        conversationData.animalId,
        accessToken,
        refreshToken
      );
    }
  });
}
