import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { useTranslation } from 'react-i18next';
import { deleteConversation } from '../api/deleteConversation';

/**
 * TanStack Mutation hook for deleting a conversation (WhatsApp-style).
 *
 * This hook follows the unified cache strategy:
 * - Performs the mutation via API
 * - Invalidates relevant queries to trigger refetch
 * - Does NOT manually mutate the cache
 *
 * @returns Mutation hook for deleting conversations
 */
export function useDeleteConversation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!isAuthenticatedUserSession(userSession)) {
        throw new Error(t('auth_required'));
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      return await deleteConversation(
        userId,
        conversationId,
        accessToken,
        refreshToken
      );
    },
    onSuccess: (data, conversationId) => {
      if (!isAuthenticatedUserSession(userSession)) {
        return;
      }

      const userId = userSession!.user.id;

      // Invalidate conversations query to remove deleted conversation from UI
      queryClient.invalidateQueries({
        queryKey: ['conversations', userId]
      });

      // Invalidate messages query for this conversation
      queryClient.invalidateQueries({
        queryKey: ['messages', conversationId]
      });

      // Invalidate unread count
      queryClient.invalidateQueries({
        queryKey: ['unreadCount']
      });

      console.log(
        `Conversation ${conversationId} ${data.hardDeleted ? 'permanently' : 'soft'} deleted`
      );
    },
    onError: (error) => {
      console.error('Failed to delete conversation:', error);
    }
  });
}
