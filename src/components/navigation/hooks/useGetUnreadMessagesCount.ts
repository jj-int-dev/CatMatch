import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { getUnreadMessagesCount } from '../api/getUnreadMessagesCount';
/**
 * Hook for fetching unread messages count
 * @returns React Query result with unread messages count
 */
export default function useGetUnreadMessagesCount() {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['unreadMessagesCount', userId],
    queryFn: async (): Promise<number> =>
      await getUnreadMessagesCount(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 // Refetch every minute
  });
}
