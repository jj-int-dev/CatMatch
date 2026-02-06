import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { getConversations } from '../api/getConversations';
import type { GetConversationsResponseSchema } from '../validators/getConversationsResponseValidator';

/**
 * Hook for fetching conversations with pagination
 * @param page Page number (default: 1)
 * @param pageSize Number of items per page (default: 20)
 * @returns React Query result with conversations data
 */
export default function useGetConversations(
  page: number = 1,
  pageSize: number = 20
) {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['conversations', userId, page, pageSize],
    queryFn: async (): Promise<GetConversationsResponseSchema> => {
      return await getConversations(
        userId!,
        accessToken!,
        refreshToken!,
        page,
        pageSize
      );
    },
    enabled: !!userId && !!accessToken && !!refreshToken,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5 // 5 minutes
  });
}
