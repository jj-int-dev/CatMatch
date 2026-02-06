import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import useGetUserType from '../../../hooks/useGetUserType';
import { useMobileNavigationGestures } from '../../../hooks/useSwipeGesture';
import {
  usePresence,
  useRealtimeConversations,
  useRealtimeMessages
} from '../hooks';
import ConversationList from './ConversationList';
import ChatInterface from './ChatInterface';
import EmptyStateAdopter from './EmptyStateAdopter';
import EmptyStateRehomer from './EmptyStateRehomer';

export default function MessagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  // Get user type using the hook
  const { data: userType, isLoading: isLoadingUserType } = useGetUserType();

  const goToLoginPage = () => navigate('/login', { replace: true });

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      }
    }
  }, [userSession, isLoadingSession]);

  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  // Use real-time hooks
  const { conversations, loading: conversationsLoading } =
    useRealtimeConversations();
  const {
    messages,
    loading: messagesLoading,
    sendMessage,
    markMessageAsRead
  } = useRealtimeMessages(selectedConversationId);
  const { onlineUsers, isUserOnline } = usePresence();

  // Check if user is adopter or rehomer
  const isAdopter = userType === 'Adopter';

  // Find selected conversation
  const selectedConversation = selectedConversationId
    ? conversations.find((c) => c.conversation_id === selectedConversationId)
    : null;

  // Handle responsive design with multiple breakpoints
  useEffect(() => {
    const checkMobile = () => {
      // Consider different screen sizes:
      // - Small mobile: < 640px (sm)
      // - Large mobile/tablet: 640px - 767px
      // - Desktop: >= 768px (md)
      const isSmallMobile = window.innerWidth < 640;
      const isMobile = window.innerWidth < 768;

      setIsMobileView(isMobile);

      if (isMobile && selectedConversationId) {
        setShowConversationList(false);
      } else if (!isMobile) {
        setShowConversationList(true);
      }

      // For very small screens, adjust layout further
      if (isSmallMobile) {
        // Additional adjustments for very small screens
        document.documentElement.style.setProperty(
          '--touch-target-size',
          '44px'
        );
      } else {
        document.documentElement.style.setProperty(
          '--touch-target-size',
          '40px'
        );
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.documentElement.style.removeProperty('--touch-target-size');
    };
  }, [selectedConversationId]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      // We need to mark individual messages as read
      // This would be implemented when we have the message IDs
      // For now, we could mark all unread messages as read
      messages.forEach((message) => {
        if (!message.is_read && message.sender_id !== userSession?.user?.id) {
          markMessageAsRead(message.message_id);
        }
      });
    }
  }, [selectedConversationId, messages, markMessageAsRead, userSession]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  // Handle back to conversation list on mobile
  const handleBackToConversations = () => {
    setShowConversationList(true);
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId || !sendMessage) return;
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle creating conversation - only adopters can create new chats
  const handleStartNewChat = () => {
    // Only adopters can create new chats by browsing cats
    if (isAdopter) {
      navigate('/discovery');
    }
    // Rehomers cannot create new chats - they can only respond to existing ones
  };

  if (isLoadingSession || isLoadingUserType) {
    return (
      <div className="bg-base-100 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/80">{t('loading_conversations')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticatedUserSession(userSession)) {
    return (
      <div className="bg-base-100 min-h-screen p-4">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-base-content mb-4 text-2xl font-bold">
            {t('messages')}
          </h1>
          <p className="text-base-content/80">
            {t('please_log_in_to_view_messages')}
          </p>
        </div>
      </div>
    );
  }

  // Determine which empty state to show
  const showEmptyState = conversations.length === 0 && !conversationsLoading;
  const showConversationView = !showEmptyState && showConversationList;

  // Use swipe gesture for mobile navigation (after all functions are declared)
  const { ref: swipeRef } = useMobileNavigationGestures(
    // Swipe right to go back to conversation list (when in chat view)
    isMobileView && !showConversationList
      ? handleBackToConversations
      : undefined,
    // Swipe left to go to chat view (when in conversation list with a selected conversation)
    isMobileView && showConversationList && selectedConversationId
      ? () => handleSelectConversation(selectedConversationId)
      : undefined
  );

  return (
    <div
      ref={swipeRef}
      className="from-base-100 to-base-200 min-h-screen bg-gradient-to-b"
    >
      {/* Mobile header */}
      {isMobileView && !showConversationList && (
        <div className="border-base-300 bg-base-100/95 sticky top-0 z-20 flex items-center border-b px-4 py-3 shadow-sm backdrop-blur-sm">
          <button
            onClick={handleBackToConversations}
            className="hover:bg-base-200 mr-3 flex h-10 w-10 items-center justify-center rounded-full"
            aria-label={t('back_to_conversations')}
          >
            <svg
              className="text-base-content h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base-content text-lg font-semibold">
              {t('messages')}
            </h1>
            {selectedConversation?.otherUserName && (
              <p className="text-base-content/70 truncate text-xs">
                {selectedConversation.otherUserName}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Desktop header */}
        {!isMobileView && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-base-content text-3xl font-bold">
                  {t('messages')}
                </h1>
                <p className="text-base-content/80 mt-2">
                  {isAdopter
                    ? t('empty_inbox_adopter_description')
                    : t('empty_inbox_rehomer_description')}
                </p>
              </div>
              {conversations.length > 0 && isAdopter && (
                <button
                  onClick={handleStartNewChat}
                  className="from-primary to-secondary btn-primary btn rounded-lg px-6 py-3 font-medium text-white shadow-lg"
                >
                  <span className="flex items-center gap-2">
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {t('new_chat')}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex h-[calc(100vh-10rem)] gap-4 md:h-[calc(100vh-12rem)] md:gap-6">
          {/* Conversation List - Desktop or Mobile when showing list */}
          {(showConversationView || !isMobileView) && (
            <div
              className={`${isMobileView ? 'w-full' : 'w-full md:w-96 lg:w-80 xl:w-96'} border-base-300 bg-base-100 overflow-hidden rounded-2xl border shadow-xl transition-all duration-300`}
            >
              <div className="border-base-300 border-b p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base-content text-lg font-semibold">
                    {t('conversations')}
                  </h2>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {conversations.length}
                  </span>
                </div>
                {isMobileView && conversations.length > 0 && isAdopter && (
                  <button
                    onClick={handleStartNewChat}
                    className="btn btn-outline btn-primary mt-3 w-full px-4 py-2 text-sm font-medium"
                  >
                    {t('new_chat')}
                  </button>
                )}
              </div>
              <ConversationList
                conversations={conversations}
                loading={conversationsLoading}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onlineUsers={onlineUsers}
                isUserOnline={isUserOnline}
              />
            </div>
          )}

          {/* Chat Interface or Empty State */}
          <div
            className={`${isMobileView ? 'w-full' : 'flex-1'} ${!showConversationList || !isMobileView ? 'block' : 'hidden md:block'} border-base-300 bg-base-100 overflow-hidden rounded-2xl border shadow-xl transition-all duration-300`}
          >
            {showEmptyState ? (
              <div className="h-full">
                {isAdopter ? (
                  <EmptyStateAdopter onStartNewChat={handleStartNewChat} />
                ) : (
                  <EmptyStateRehomer onStartNewChat={handleStartNewChat} />
                )}
              </div>
            ) : selectedConversation ? (
              <ChatInterface
                conversation={selectedConversation}
                messages={messages}
                loading={messagesLoading}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center md:p-12">
                <div className="from-primary/10 to-secondary/10 mb-8 rounded-full bg-gradient-to-br p-10">
                  <svg
                    className="text-primary h-20 w-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h2 className="text-base-content mb-4 text-2xl font-bold">
                  {t('select_conversation')}
                </h2>
                <p className="text-base-content/80 mb-8 max-w-md text-lg">
                  {t('select_conversation_description')}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  {conversations.length > 0 ? (
                    <>
                      <button
                        onClick={() => {
                          if (conversations.length > 0) {
                            handleSelectConversation(
                              conversations[0].conversation_id
                            );
                          }
                        }}
                        className="from-primary to-secondary btn-primary btn rounded-lg px-8 py-3 font-medium text-white shadow-lg"
                      >
                        {t('open_first_conversation')}
                      </button>
                      {isAdopter && (
                        <button
                          onClick={handleStartNewChat}
                          className="border-primary text-primary btn btn-outline rounded-lg px-8 py-3 font-medium"
                        >
                          {t('start_new_chat')}
                        </button>
                      )}
                    </>
                  ) : (
                    isAdopter && (
                      <button
                        onClick={handleStartNewChat}
                        className="from-primary to-secondary btn-primary btn rounded-lg px-8 py-3 font-medium text-white shadow-lg"
                      >
                        {t('start_your_first_chat')}
                      </button>
                    )
                  )}
                </div>
                {isMobileView && conversations.length > 0 && (
                  <button
                    onClick={handleBackToConversations}
                    className="btn btn-ghost mt-8 rounded-lg px-6 py-3 font-medium"
                  >
                    {t('back_to_conversations')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile floating action button */}
        {isMobileView &&
          showConversationList &&
          conversations.length > 0 &&
          isAdopter && (
            <button
              onClick={handleStartNewChat}
              className="from-primary to-secondary fixed right-6 bottom-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-xl"
              aria-label={t('new_chat')}
            >
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
      </div>
    </div>
  );
}
