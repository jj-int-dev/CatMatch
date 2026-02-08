import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../stores/auth-store';
import type { ConversationSchema } from '../../../validators/conversationValidator';

interface ConversationListProps {
  conversations: ConversationSchema[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  loading?: boolean;
  error?: string | null;
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
}

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  loading = false,
  error = null,
  onlineUsers,
  isUserOnline
}: ConversationListProps) {
  const { t } = useTranslation();
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id;

  // Helper function to format relative time using translations
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t('just_now');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('minutes_ago', { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('hours_ago', { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('days_ago', { count: days });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">{t('loading_conversations')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          {t('no_conversations')}
        </h3>
        <p className="text-center text-gray-500">
          {t('no_conversations_description')}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-2 p-2">
        {conversations.map((conversation) => {
          const otherUserId =
            conversation.adopter_id === userId
              ? conversation.rehomer_id
              : conversation.adopter_id;
          const isOnline = isUserOnline(otherUserId);
          const isSelected =
            selectedConversationId === conversation.conversation_id;
          const hasUnread =
            conversation.unreadCount && conversation.unreadCount > 0;
          const lastMessageTime = conversation.last_message_at
            ? new Date(conversation.last_message_at)
            : null;

          return (
            <button
              key={conversation.conversation_id}
              onClick={() => onSelectConversation(conversation.conversation_id)}
              className={`w-full rounded-lg p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100 ${
                isSelected
                  ? 'border border-blue-200 bg-blue-50'
                  : 'border border-transparent'
              }`}
              aria-label={`Open conversation with ${conversation.otherUserName || 'user'}`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                    {conversation.otherUserProfilePicture ? (
                      <img
                        src={conversation.otherUserProfilePicture}
                        alt={conversation.otherUserName || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xl font-semibold text-blue-600">
                          {conversation.otherUserName?.[0]?.toUpperCase() ||
                            'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Online indicator */}
                  {isOnline && (
                    <div className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                  )}
                </div>

                {/* Conversation details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="truncate text-base font-medium text-gray-900">
                      {conversation.otherUserName ||
                        `User ${otherUserId.substring(0, 8)}...`}
                    </h4>
                    {lastMessageTime && (
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(lastMessageTime)}
                      </span>
                    )}
                  </div>

                  {conversation.animalName && (
                    <p className="truncate text-sm text-gray-600">
                      {conversation.animalName}
                    </p>
                  )}

                  {conversation.last_message_at && (
                    <p className="truncate text-sm text-gray-500">
                      {t('last_message')}:{' '}
                      {lastMessageTime?.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>

                {/* Unread indicator */}
                {hasUnread && (
                  <div className="flex items-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Online users section */}
      <div className="border-t p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          {t('online_users')} ({onlineUsers.length})
        </h3>
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-gray-500">{t('no_users_online')}</p>
        ) : (
          <div className="space-y-2">
            {onlineUsers.map((onlineUserId) => (
              <div key={onlineUserId} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">
                  {onlineUserId === userId
                    ? t('you')
                    : `User ${onlineUserId.substring(0, 8)}...`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
