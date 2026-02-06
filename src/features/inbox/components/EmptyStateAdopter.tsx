import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface EmptyStateAdopterProps {
  onStartNewChat?: () => void;
}

export default function EmptyStateAdopter({
  onStartNewChat
}: EmptyStateAdopterProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBrowseCats = () => {
    navigate('/discovery');
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <svg
          className="h-16 w-16 text-blue-500"
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

      <h2 className="mb-3 text-2xl font-bold text-gray-900">
        {t('empty_inbox_adopter')}
      </h2>

      <p className="mb-8 max-w-md text-gray-600">
        {t('empty_inbox_adopter_description')}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleBrowseCats}
          className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white hover:bg-blue-600"
        >
          {t('browse_cats', 'Browse Cats to Adopt')}
        </button>

        {onStartNewChat && (
          <button
            onClick={onStartNewChat}
            className="rounded-lg border border-blue-500 px-6 py-3 font-medium text-blue-500 hover:bg-blue-50"
          >
            {t('new_chat')}
          </button>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-medium text-gray-900">
            {t('find_cats', 'Find Cats')}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              'find_cats_description',
              'Browse through cats available for adoption in your area'
            )}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <svg
              className="h-6 w-6 text-purple-600"
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
          <h3 className="mb-2 font-medium text-gray-900">
            {t('message_owners', 'Message Owners')}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              'message_owners_description',
              'Send messages to cat owners to learn more about their cats'
            )}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-medium text-gray-900">
            {t('arrange_adoption', 'Arrange Adoption')}
          </h3>
          <p className="text-sm text-gray-600">
            {t(
              'arrange_adoption_description',
              'Coordinate with owners to bring your new furry friend home'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
