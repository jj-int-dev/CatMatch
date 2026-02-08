import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { MessageSchema } from '../../../validators/messageValidator';

/**
 * Real-time sync hook for messages - Unified cache strategy
 *
 * This hook subscribes to message changes and invalidates TanStack Query cache
 * instead of managing state directly. This ensures the query cache is the single source of truth.
 *
 * @param conversationId - The conversation to sync messages for
 */
export function useRealtimeMessagesSync(conversationId: string | null) {
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  useEffect(() => {
    if (
      !isLoadingSession &&
      isAuthenticatedUserSession(userSession) &&
      conversationId
    ) {
      const userId = userSession!.user.id;

      // Subscribe to real-time updates for messages in this conversation
      const channel = supabase
        .channel(`messages-sync:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload: RealtimePostgresChangesPayload<MessageSchema>) => {
            console.log('Message change received:', payload.eventType);

            // Invalidate messages query for this conversation
            queryClient.invalidateQueries({
              queryKey: ['messages', conversationId]
            });

            // Invalidate conversations query to update last_message_at
            queryClient.invalidateQueries({
              queryKey: ['conversations', userId]
            });

            // If a new message was inserted or read status changed, update unread count
            if (
              payload.eventType === 'INSERT' ||
              payload.eventType === 'UPDATE'
            ) {
              queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            }
          }
        )
        .subscribe((status) => {
          console.log(
            `Messages sync subscription status for ${conversationId}:`,
            status
          );
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [
    isLoadingSession,
    userSession,
    conversationId,
    queryClient,
    isAuthenticatedUserSession
  ]);
}
