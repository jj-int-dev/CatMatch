import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/auth-store';
import { createConversation } from '../api/createConversation';
import { sendMessage as apiSendMessage } from '../api/sendMessage';

/**
 * Shared hook for initiating a conversation from any feature
 * This decouples the conversation creation logic from specific features
 *
 * Usage:
 * ```tsx
 * const { initiateConversation, isPending } = useInitiateConversation();
 * await initiateConversation({
 *   rehomerId: '...',
 *   animalId: '...',
 *   initialMessage: 'Hello!'
 * });
 * ```
 */
export function useInitiateConversation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const mutation = useMutation({
    mutationFn: async ({
      rehomerId,
      animalId,
      initialMessage
    }: {
      rehomerId: string;
      animalId: string;
      initialMessage: string;
    }) => {
      if (!isAuthenticatedUserSession(userSession)) {
        throw new Error(t('user_not_authenticated'));
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      // Step 1: Create or get the conversation (unique to adopter + rehomer + animal)
      const conversationResponse = await createConversation(
        userId,
        rehomerId,
        animalId,
        accessToken,
        refreshToken
      );

      if (!conversationResponse?.conversation?.conversationId) {
        throw new Error(t('create_conversation_error'));
      }

      const conversationId = conversationResponse.conversation.conversationId;

      // Step 2: Send the initial message
      const messageResponse = await apiSendMessage(
        userId,
        conversationId,
        initialMessage,
        accessToken,
        refreshToken
      );

      return {
        conversation: conversationResponse.conversation,
        message: messageResponse.message
      };
    },
    onSuccess: (data) => {
      // Invalidate conversations queries to show the new conversation
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: ['messages', data.conversation.conversationId]
      });

      // Invalidate unread count
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

      console.log(
        'Conversation initiated successfully:',
        data.conversation.conversationId
      );
    },
    onError: (error) => {
      console.error('Failed to initiate conversation:', error);
    }
  });

  return {
    initiateConversation: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
}
