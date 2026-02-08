import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { ConversationSchema } from '../../../validators/conversationValidator';

/**
 * Real-time sync hook for conversations - Unified cache strategy
 *
 * This hook subscribes to conversation changes and invalidates TanStack Query cache
 * instead of managing state directly. This ensures the query cache is the single source of truth.
 */
export function useRealtimeConversationsSync() {
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  useEffect(() => {
    if (!isLoadingSession && isAuthenticatedUserSession(userSession)) {
      const userId = userSession!.user.id;

      // Subscribe to real-time updates for conversations
      // No server-side filter - we'll check client-side if user is a participant
      const channel = supabase
        .channel(`conversations-sync:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations'
          },
          (payload: RealtimePostgresChangesPayload<ConversationSchema>) => {
            console.log('Conversation change received:', payload.eventType);

            // Client-side filter: only process if user is a participant
            const newConv = payload.new as ConversationSchema;
            const oldConv = payload.old as ConversationSchema;

            const isParticipant =
              newConv?.adopter_id === userId ||
              newConv?.rehomer_id === userId ||
              oldConv?.adopter_id === userId ||
              oldConv?.rehomer_id === userId;

            if (!isParticipant) {
              console.log('Ignoring conversation - user not a participant');
              return;
            }

            // Invalidate conversations query to trigger refetch
            queryClient.invalidateQueries({
              queryKey: ['conversations', userId]
            });

            // If conversation was updated, also invalidate unread count
            if (
              payload.eventType === 'UPDATE' ||
              payload.eventType === 'INSERT'
            ) {
              queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
            }
          }
        )
        .subscribe((status) => {
          console.log(
            `Conversations sync subscription status for ${userId}:`,
            status
          );
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoadingSession, userSession, queryClient, isAuthenticatedUserSession]);
}
