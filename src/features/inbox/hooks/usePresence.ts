import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../utils/supabase-client';
import { useAuthStore } from '../../../stores/auth-store';

/**
 * Hook for presence tracking (online/offline status)
 * @returns Object containing online users and functions to track presence
 */
export function usePresence() {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        return;
      }

      const channel = supabase.channel('online-users', {
        config: {
          presence: {
            key: userSession!.user.id
          }
        }
      });

      // Track presence
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const onlineUserIds = new Set<string>();

          Object.values(state).forEach((presenceEntries: any) => {
            presenceEntries.forEach((presence: any) => {
              onlineUserIds.add(presence.key);
            });
          });

          setOnlineUsers(onlineUserIds);
          console.log('Online users:', onlineUserIds);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              online_at: new Date().toISOString(),
              user_id: userSession!.user.id
            });
          }
        });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [isLoadingSession, userSession]);

  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  return {
    onlineUsers: Array.from(onlineUsers),
    isUserOnline
  };
}
