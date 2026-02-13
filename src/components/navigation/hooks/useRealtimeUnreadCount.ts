import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';
import { getUnreadMessagesCount } from '../api/getUnreadMessagesCount';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Hook for real-time unread messages count with TanStack Query
 *
 * This hook follows the unified cache strategy:
 * - Uses TanStack Query to fetch and cache unread count
 * - Subscribes to message changes and invalidates the query to trigger refetch
 * - Works seamlessly with invalidateQueries calls from other hooks
 *
 * @returns Object containing unread count and loading state
 */
export default function useRealtimeUnreadCount() {
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  // Use TanStack Query to fetch and cache unread count
  const query = useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      if (!isAuthenticatedUserSession(userSession)) {
        return 0;
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      try {
        const count = await getUnreadMessagesCount(
          userId,
          accessToken,
          refreshToken
        );
        return count;
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        return 0;
      }
    },
    enabled: !isLoadingSession && isAuthenticatedUserSession(userSession),
    staleTime: 0, // Always consider data stale to allow frequent refetches
    refetchOnWindowFocus: true // Refetch when user returns to the app
  });

  // Subscribe to real-time message changes and invalidate query
  useEffect(() => {
    if (!isLoadingSession && isAuthenticatedUserSession(userSession)) {
      const userId = userSession!.user.id;

      // Subscribe to real-time message changes
      // We need to know about INSERT (new messages) and UPDATE (messages marked as read)
      const channel = supabase
        .channel(`unread-count:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
            // No filter - we'll invalidate query on any message change
            // This is simpler and more reliable than trying to calculate client-side
          },
          (_payload: RealtimePostgresChangesPayload<any>) => {
            console.log(
              'Message change detected, invalidating unread count query'
            );

            // Invalidate the query to trigger refetch
            // This ensures accuracy and avoids complex client-side logic
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
          }
        )
        .subscribe((status) => {
          console.log(
            `Unread count subscription status for ${userId}:`,
            status
          );
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoadingSession, userSession, isAuthenticatedUserSession, queryClient]);

  return {
    data: query.data ?? 0,
    isLoading: query.isLoading
  };
}
