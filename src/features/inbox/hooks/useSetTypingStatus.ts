import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { setTypingStatus } from '../api/setTypingStatus';

/**
 * Hook for setting typing status in a conversation
 * @returns React Query mutation for setting typing status
 */
export default function useSetTypingStatus() {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async ({
      conversationId,
      isTyping
    }: {
      conversationId: string;
      isTyping: boolean;
    }) => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error('User not authenticated');
      }

      return await setTypingStatus(
        userId,
        conversationId,
        accessToken,
        refreshToken,
        isTyping
      );
    },
    onError: (error) => {
      console.error('Failed to set typing status:', error);
    }
  });
}
