import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { getMessages } from '../api/getMessages';

/**
 * TanStack Query hook for fetching messages in a conversation
 *
 * This hook uses TanStack Query for data fetching and caching.
 * Real-time subscriptions should invalidate this query instead of managing state directly.
 *
 * @param conversationId - The conversation ID to fetch messages for
 * @param page - Page number (default: 1)
 * @param pageSize - Number of messages per page (default: 50)
 * @returns Query result with messages data
 */
export function useGetMessagesQuery(
  conversationId: string | null,
  page: number = 1,
  pageSize: number = 50
) {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  return useQuery({
    queryKey: ['messages', conversationId, page, pageSize],
    queryFn: async () => {
      if (!isAuthenticatedUserSession(userSession)) {
        throw new Error('User not authenticated');
      }

      if (!conversationId) {
        throw new Error('Conversation ID required');
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      const response = await getMessages(
        userId,
        conversationId,
        accessToken,
        refreshToken,
        page,
        pageSize
      );

      return response;
    },
    enabled:
      !isLoadingSession &&
      isAuthenticatedUserSession(userSession) &&
      !!conversationId,
    staleTime: 10000, // Consider data fresh for 10 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
}
