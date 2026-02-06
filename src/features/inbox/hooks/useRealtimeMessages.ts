import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../utils/supabase-client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { MessageSchema } from '../validators/messageValidator';
import { useAuthStore } from '../../../stores/auth-store';
import { useTranslation } from 'react-i18next';
import { getMessages } from '../api/getMessages';
import { sendMessage as apiSendMessage } from '../api/sendMessage';

/**
 * Hook for subscribing to real-time message updates for a specific conversation
 * @param conversationId The ID of the conversation to subscribe to
 * @returns Object containing messages, loading state, and error
 */
export function useRealtimeMessages(conversationId: string | null) {
  const { t } = useTranslation();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [messages, setMessages] = useState<MessageSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to message changes
  useEffect(() => {
    if (!isLoadingSession) {
      if (!isAuthenticatedUserSession(userSession) || !conversationId) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Fetch initial messages
      const fetchMessages = async () => {
        try {
          const response = await getMessages(
            userSession!.user.id,
            conversationId,
            userSession!.access_token,
            userSession!.refresh_token,
            1,
            50
          );
          setMessages(response.messages);
        } catch (err) {
          setError(t('get_messages_error'));
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();

      // Subscribe to real-time updates for this conversation
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload: RealtimePostgresChangesPayload<MessageSchema>) => {
            console.log('Message change received:', payload);

            switch (payload.eventType) {
              case 'INSERT':
                setMessages((prev) => [...prev, payload.new as MessageSchema]);
                // Mark message as read if it's from the other user
                if (
                  userSession!.user.id &&
                  payload.new.sender_id !== userSession!.user.id
                ) {
                  markMessageAsRead(payload.new.message_id);
                }
                break;

              case 'UPDATE':
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.message_id === payload.new.message_id
                      ? (payload.new as MessageSchema)
                      : msg
                  )
                );
                break;

              case 'DELETE':
                setMessages((prev) =>
                  prev.filter(
                    (msg) => msg.message_id !== payload.old?.message_id
                  )
                );
                break;
            }
          }
        )
        .subscribe((status) => {
          console.log(
            `Subscription status for conversation ${conversationId}:`,
            status
          );
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, isLoadingSession, userSession]);

  const markMessageAsRead = useCallback(async (messageId: string) => {
    try {
      // TODO: Implement API call to mark message as read
      console.log('Marking message as read:', messageId);
    } catch (err) {
      console.error('Failed to mark message as read:', err);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string): Promise<MessageSchema | null> => {
      if (
        (!isLoadingSession && !isAuthenticatedUserSession(userSession)) ||
        !conversationId
      ) {
        setError(t('user_and_convo_required'));
        return null;
      }

      try {
        const response = await apiSendMessage(
          userSession!.user.id,
          conversationId,
          content,
          userSession!.access_token,
          userSession!.refresh_token
        );
        return response.message;
      } catch (err) {
        setError(t('send_message_error'));
        return null;
      }
    },
    [conversationId, userSession]
  );

  return {
    messages,
    loading,
    error,
    sendMessage,
    markMessageAsRead
  };
}
