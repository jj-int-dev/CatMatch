import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../stores/auth-store';
import useSetTypingStatus from '../hooks/useSetTypingStatus';
import type { MessageSchema } from '../../../validators/messageValidator';
import type { ConversationSchema } from '../validators/getConversationsResponseValidator';

interface ChatInterfaceProps {
  conversation: ConversationSchema | null;
  messages: MessageSchema[];
  loading?: boolean;
  error?: string | null;
  onSendMessage: (content: string) => Promise<void>;
  onMarkAsRead?: (conversationId: string) => Promise<void>;
}

export default function ChatInterface({
  conversation,
  messages,
  loading = false,
  error = null,
  onSendMessage,
  onMarkAsRead
}: ChatInterfaceProps) {
  const { t } = useTranslation();
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id;

  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: setTypingStatus } = useSetTypingStatus();

  // Determine if other user is typing based on conversation data
  const otherUserTyping = React.useMemo(() => {
    if (!conversation || !userId) return false;

    const isAdopter = conversation.adopterId === userId;
    return isAdopter
      ? conversation.rehomerIsTyping
      : conversation.adopterIsTyping;
  }, [conversation, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (conversation && onMarkAsRead) {
      onMarkAsRead(conversation.conversationId);
    }
  }, [conversation, onMarkAsRead]);

  // Handle typing detection and send typing status to server
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (newMessage.trim() && conversation) {
      // Send typing status to server
      setTypingStatus({
        conversationId: conversation.conversationId,
        isTyping: true
      });

      // Set timeout to stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (conversation) {
          setTypingStatus({
            conversationId: conversation.conversationId,
            isTyping: false
          });
        }
      }, 3000);
    } else if (conversation) {
      // Send stop typing status
      setTypingStatus({
        conversationId: conversation.conversationId,
        isTyping: false
      });
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newMessage, conversation, setTypingStatus]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!conversation) {
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          {t('select_conversation')}
        </h3>
        <p className="text-center text-gray-500">{t('select_conversation')}</p>
      </div>
    );
  }

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

  const otherUserId =
    conversation.adopterId === userId
      ? conversation.rehomerId
      : conversation.adopterId;

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
              {conversation.otherUserProfilePicture ? (
                <img
                  src={conversation.otherUserProfilePicture}
                  alt={conversation.otherUserName || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {conversation.otherUserName?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {conversation.otherUserName ||
                `User ${otherUserId.substring(0, 8)}...`}
            </h3>
            {conversation.animalName && (
              <p className="text-sm text-gray-600">{conversation.animalName}</p>
            )}
          </div>
          {conversation.unreadCount && conversation.unreadCount > 0 ? (
            <div className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
              {conversation.unreadCount}{' '}
              {t('unread', { count: conversation.unreadCount })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
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
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {t('no_messages')}
            </h3>
            <p className="text-center text-gray-500">
              {t('no_messages_description')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === userId;
              const messageTime = new Date(message.createdAt);
              const readTime = message.readAt ? new Date(message.readAt) : null;

              return (
                <div
                  key={message.messageId}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-200 bg-white text-gray-900'
                    }`}
                  >
                    <div className="mb-1">{message.content}</div>
                    <div
                      className={`flex items-center justify-between text-xs ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      <span>
                        {messageTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isOwnMessage && (
                        <span className="ml-2">
                          {readTime ? (
                            <span
                              title={t('read_at', {
                                time: readTime.toLocaleString()
                              })}
                              className="font-bold text-[#34B7F1]"
                            >
                              ✓✓
                            </span>
                          ) : message.isRead ? (
                            <span title={t('read')}>✓✓</span>
                          ) : (
                            <span title={t('unread')}>✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            {/* Typing indicator */}
            {otherUserTyping && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div className="animation-delay-150 h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div className="animation-delay-300 h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {conversation.otherUserName || 'User'} is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('type_message')}
              className="min-h-[60px] w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none sm:min-h-[80px]"
              rows={2}
              disabled={isSending}
            />
          </div>
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="min-h-[44px] rounded-lg bg-blue-500 px-6 py-3 text-base font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300 sm:min-h-[60px]"
              aria-label={t('send_message')}
            >
              {isSending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{t('sending')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>{t('send')}</span>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {t(
            'press_enter_to_send',
            'Press Enter to send, Shift+Enter for new line'
          )}
        </div>
      </div>
    </div>
  );
}
