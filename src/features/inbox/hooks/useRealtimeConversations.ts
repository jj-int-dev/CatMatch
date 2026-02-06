import { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';
import { useTranslation } from 'react-i18next';
import { getConversations } from '../api/getConversations';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { ConversationSchema } from '../validators/conversationValidator';

/**
 * Hook for subscribing to real-time conversation updates for a user
 * @returns Object containing conversations, loading state, and error
 */
export function useRealtimeConversations() {
  const { t } = useTranslation();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [conversations, setConversations] = useState<ConversationSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        setConversations([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch initial conversations
      const fetchConversations = async () => {
        try {
          const conversationsData = await getConversations(
            userSession!.user.id,
            userSession!.access_token,
            userSession!.refresh_token,
            1, // page
            50 // pageSize - fetch a reasonable number of conversations
          );

          setConversations(conversationsData.conversations);
        } catch (err) {
          console.error('Failed to fetch conversations:', err);
          setError(t('get_conversations_error'));
        } finally {
          setLoading(false);
        }
      };

      fetchConversations();

      // Subscribe to real-time updates for conversations involving this user
      const channel = supabase
        .channel(`conversations:${userSession!.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'conversations',
            filter: `adopter_id=eq.${userSession!.user.id},rehomer_id=eq.${userSession!.user.id}`
          },
          (payload: RealtimePostgresChangesPayload<ConversationSchema>) => {
            console.log('Conversation change received:', payload);

            switch (payload.eventType) {
              case 'INSERT':
                setConversations((prev) => [
                  ...prev,
                  payload.new as ConversationSchema
                ]);
                break;

              case 'UPDATE':
                setConversations((prev) =>
                  prev.map((conv) =>
                    conv.conversation_id === payload.new.conversation_id
                      ? (payload.new as ConversationSchema)
                      : conv
                  )
                );
                break;

              case 'DELETE':
                setConversations((prev) =>
                  prev.filter(
                    (conv) =>
                      conv.conversation_id !== payload.old?.conversation_id
                  )
                );
                break;
            }
          }
        )
        .subscribe((status) => {
          console.log(
            `Subscription status for user ${userSession!.user.id}:`,
            status
          );
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoadingSession, userSession]);

  return {
    conversations,
    loading,
    error
  };
}
