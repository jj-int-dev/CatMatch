import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { getConversations } from '../api/getConversations';

/**
 * TanStack Query hook for fetching conversations
 *
 * This hook uses TanStack Query for data fetching and caching.
 * Real-time subscriptions should invalidate this query instead of managing state directly.
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Number of conversations per page (default: 50)
 * @returns Query result with conversations data
 */
export function useGetConversationsQuery(
  page: number = 1,
  pageSize: number = 50
) {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  return useQuery({
    queryKey: ['conversations', userSession?.user?.id, page, pageSize],
    queryFn: async () => {
      if (!isAuthenticatedUserSession(userSession)) {
        throw new Error('User not authenticated');
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      const response = await getConversations(
        userId,
        accessToken,
        refreshToken,
        page,
        pageSize
      );

      return response;
    },
    enabled: !isLoadingSession && isAuthenticatedUserSession(userSession),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
}
