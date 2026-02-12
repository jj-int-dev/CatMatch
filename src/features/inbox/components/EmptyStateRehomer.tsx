import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface EmptyStateRehomerProps {
  onStartNewChat?: () => void;
}

export default function EmptyStateRehomer({
  onStartNewChat: _onStartNewChat
}: EmptyStateRehomerProps) {
  // onStartNewChat is not used because rehomers cannot create new chats
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleManageCats = () => {
    navigate('/rehomer/dashboard');
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto p-8 py-12 text-center">
      <div className="from-primary/10 to-secondary/10 mb-6 rounded-full bg-gradient-to-br p-8">
        <svg
          className="text-primary h-16 w-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      </div>

      <h2 className="text-base-content mb-3 text-2xl font-bold">
        {t('empty_inbox_rehomer')}
      </h2>

      <p className="text-base-content/80 mb-8 max-w-md">
        {t('empty_inbox_rehomer_description')}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleManageCats}
          className="btn btn-primary rounded-lg px-6 py-3 font-medium"
        >
          {t('manage_cats', 'Manage Your Cats')}
        </button>

        {/* Rehomers cannot create new chats - only respond to existing ones */}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border-base-300 bg-base-100 rounded-lg border p-6">
          <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-primary h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-base-content mb-2 font-medium">
            {t('list_cats', 'List Your Cats')}
          </h3>
          <p className="text-base-content/80 text-sm">
            {t(
              'list_cats_description',
              'Create detailed listings for cats you want to rehome'
            )}
          </p>
        </div>

        <div className="border-base-300 bg-base-100 rounded-lg border p-6">
          <div className="bg-secondary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-secondary h-6 w-6"
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
          <h3 className="text-base-content mb-2 font-medium">
            {t('respond_messages', 'Respond to Messages')}
          </h3>
          <p className="text-base-content/80 text-sm">
            {t(
              'respond_messages_description',
              'Answer questions from potential adopters about your cats'
            )}
          </p>
        </div>

        <div className="border-base-300 bg-base-100 rounded-lg border p-6">
          <div className="bg-success/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <svg
              className="text-success h-6 w-6"
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
          <h3 className="text-base-content mb-2 font-medium">
            {t('find_homes', 'Find Forever Homes')}
          </h3>
          <p className="text-base-content/80 text-sm">
            {t(
              'find_homes_description',
              'Help your cats find loving, permanent homes with caring families'
            )}
          </p>
        </div>
      </div>

      <div className="bg-info/10 border-info/20 mt-8 rounded-lg border p-6">
        <h3 className="text-info-content mb-3 font-medium">
          {t('tips_for_rehomers', 'Tips for Successful Rehoming')}
        </h3>
        <ul className="text-info-content space-y-2 text-left text-sm">
          <li className="flex items-start">
            <svg
              className="text-info mr-2 h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              {t(
                'tip_be_honest',
                "Be honest about your cat's personality and needs"
              )}
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="text-info mr-2 h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              {t(
                'tip_respond_promptly',
                'Respond to messages promptly to keep potential adopters engaged'
              )}
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="text-info mr-2 h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>
              {t(
                'tip_ask_questions',
                'Ask questions to ensure your cat goes to a suitable home'
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
