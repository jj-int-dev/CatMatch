import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthStore } from '../../../stores/auth-store';
import { useDeleteConversation } from '../hooks/useDeleteConversation';
import type { ConversationSchema } from '../validators/getConversationsResponseValidator';

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
  const deleteConversation = useDeleteConversation();
  const [conversationToDelete, setConversationToDelete] = useState<
    string | null
  >(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conversationId);
    deleteConversation.reset(); // Clear any previous errors
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      deleteConversation.mutate(conversationToDelete, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          setConversationToDelete(null);
        }
        // onError is handled by displaying deleteConversation.error in UI
      });
    }
  };

  const handleCancelDelete = () => {
    deleteConversation.reset(); // Clear any errors
    setShowDeleteConfirm(false);
    setConversationToDelete(null);
  };

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
        <h3 className="text-base-content mb-2 text-lg font-medium">
          {t('no_conversations')}
        </h3>
        <p className="text-center text-gray-500">
          {t('no_conversations_description')}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {t('delete_conversation')}
            </h3>
            <p className="mb-6 text-gray-600">{t('are_you_sure_delete')}</p>

            {/* Error Message */}
            {deleteConversation.isError && deleteConversation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">
                  {deleteConversation.error.message}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                disabled={deleteConversation.isPending}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={deleteConversation.isPending}
              >
                {deleteConversation.isPending ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-full overflow-y-auto">
        <div className="space-y-2 p-2">
          {conversations.map((conversation) => {
            const otherUserId =
              conversation.adopterId === userId
                ? conversation.rehomerId
                : conversation.adopterId;
            const isOnline = isUserOnline(otherUserId);
            const isSelected =
              selectedConversationId === conversation.conversationId;
            const hasUnread =
              conversation.unreadCount && conversation.unreadCount > 0;
            const lastMessageTime = conversation.lastMessageAt
              ? new Date(conversation.lastMessageAt)
              : null;

            return (
              <div
                key={conversation.conversationId}
                className={`group relative w-full rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                  isSelected
                    ? 'border border-blue-200 bg-blue-50'
                    : 'border border-transparent'
                }`}
              >
                <button
                  onClick={() =>
                    onSelectConversation(conversation.conversationId)
                  }
                  className="w-full text-left"
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
                    <div className="min-w-0 flex-1 pr-12">
                      <div className="flex items-center justify-between gap-3">
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

                      {conversation.lastMessageAt && (
                        <p className="truncate text-sm text-gray-500">
                          {t('last_message')}:{' '}
                          {lastMessageTime?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Unread indicator */}
                {hasUnread ? (
                  <div className="absolute top-2 right-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                      {conversation.unreadCount}
                    </span>
                  </div>
                ) : null}

                {/* Delete Button */}
                <button
                  onClick={(e) =>
                    handleDeleteClick(conversation.conversationId, e)
                  }
                  className="absolute right-2 bottom-2 flex items-center justify-center rounded-full p-2 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                  aria-label={t('delete_conversation')}
                  title={t('delete_conversation')}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
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
    </>
  );
}
