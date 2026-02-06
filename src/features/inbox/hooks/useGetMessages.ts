import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { getMessages } from '../api/getMessages';
import type { GetMessagesResponseSchema } from '../validators/getMessagesResponseValidator';

/**
 * Hook for fetching messages in a conversation with pagination
 * @param conversationId The ID of the conversation
 * @param page Page number (default: 1)
 * @param pageSize Number of items per page (default: 20)
 * @returns React Query result with messages data
 */
export default function useGetMessages(
  conversationId: string,
  page: number = 1,
  pageSize: number = 20
) {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['messages', conversationId, userId, page, pageSize],
    queryFn: async (): Promise<GetMessagesResponseSchema> => {
      return await getMessages(
        userId!,
        conversationId,
        accessToken!,
        refreshToken!,
        page,
        pageSize
      );
    },
    enabled: !!conversationId && !!userId && !!accessToken && !!refreshToken,
    staleTime: 1000 * 30, // 30 seconds (messages update more frequently)
    gcTime: 1000 * 60 * 2 // 2 minutes
  });
}
