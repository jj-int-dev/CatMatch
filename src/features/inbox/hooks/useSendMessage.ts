import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import { sendMessage } from '../api/sendMessage';
import type { SendMessageResponseSchema } from '../validators/sendMessageResponseValidator';
import type { SendMessageRequest } from '../types/SendMessageRequest';

/**
 * Hook for sending a message in a conversation
 * @returns React Query mutation for sending messages
 */
export default function useSendMessage() {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content
    }: SendMessageRequest): Promise<SendMessageResponseSchema> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      return await sendMessage(
        userId!,
        conversationId,
        content,
        accessToken,
        refreshToken
      );
    },
    onSuccess: (_data, variables) => {
      // Invalidate the messages query for this conversation to refetch
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.conversationId, userId]
      });
      // Also invalidate conversations to update last_message_at
      queryClient.invalidateQueries({
        queryKey: ['conversations', userId]
      });
    }
  });
}
