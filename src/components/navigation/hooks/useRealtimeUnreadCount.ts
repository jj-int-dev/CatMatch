import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';
import { getUnreadMessagesCount } from '../api/getUnreadMessagesCount';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Hook for real-time unread messages count with Supabase subscription
 * Subscribes to message changes and updates count in real-time
 * @returns Object containing unread count and loading state
 */
export default function useRealtimeUnreadCount() {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoadingSession) {
      if (!isAuthenticatedUserSession(userSession)) {
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      const userId = userSession!.user.id;
      const accessToken = userSession!.access_token;
      const refreshToken = userSession!.refresh_token;

      // Fetch initial count
      const fetchInitialCount = async () => {
        try {
          const count = await getUnreadMessagesCount(
            userId,
            accessToken,
            refreshToken
          );
          setUnreadCount(count);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          setUnreadCount(0);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialCount();

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
            // No filter - we'll refetch count on any message change
            // This is simpler and more reliable than trying to calculate client-side
          },
          async (_payload: RealtimePostgresChangesPayload<any>) => {
            console.log('Message change detected, refetching unread count');

            // Refetch the count from the server
            // This ensures accuracy and avoids complex client-side logic
            try {
              const count = await getUnreadMessagesCount(
                userId,
                accessToken,
                refreshToken
              );
              setUnreadCount(count);
            } catch (error) {
              console.error('Failed to refetch unread count:', error);
            }
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
  }, [isLoadingSession, userSession, isAuthenticatedUserSession]);

  return {
    data: unreadCount,
    isLoading: loading
  };
}
