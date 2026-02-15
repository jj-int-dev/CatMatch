import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../stores/auth-store';
import {
  TbGenderMale,
  TbGenderFemale,
  TbMessageCircle,
  TbX,
  TbSend
} from 'react-icons/tb';
import { IoArrowBack } from 'react-icons/io5';
import useGetAnimal from '../hooks/useGetAnimal';
import getAgeDisplay from '../utils/getAgeDisplay';
import defaultCatPic from '../../../assets/default_cat.webp';
import { useInitiateConversation } from '../../../hooks/useInitiateConversation';
import useGetUserType from '../../../hooks/useGetUserType';

export default function AnimalDetails() {
  const { animalId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  // Get user type
  const { data: userType, isLoading: isLoadingUserType } = useGetUserType();

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToRehomerDashboard = () =>
    navigate('/rehomer/dashboard', { replace: true });

  useEffect(() => {
    if (!isLoadingSession && !isLoadingUserType) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
        return;
      }

      // Check if user is a rehomer and redirect if they are
      if (userType === 'Rehomer') {
        goToRehomerDashboard();
      }
    }
  }, [userSession, isLoadingSession, isLoadingUserType, userType]);

  const { data, isLoading: isGettingAnimal } = useGetAnimal(animalId!);

  const animal = data?.animal;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(
    null
  );

  // Use shared messaging hook
  const { initiateConversation, isPending: isInitiatingConversation } =
    useInitiateConversation();

  const handleSendMessage = async () => {
    if (!message.trim() || !animal || !animal.rehomerId || !animal.animalId)
      return;

    try {
      // Initiate conversation with initial message (single atomic operation)
      await initiateConversation({
        rehomerId: animal.rehomerId,
        animalId: animal.animalId,
        initialMessage: message.trim()
      });

      // Close chat dialog immediately
      setIsChatOpen(false);
      setMessage('');

      // Show success toast after a short delay (after dialog closes)
      setTimeout(() => {
        setToastMessage(t('message_sent'));
        setShowToast(true);
      }, 100);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      // Navigate to inbox after successful message send
      setTimeout(() => {
        navigate('/inbox');
      }, 1500);
    } catch (error) {
      console.error('Failed to send message:', error);

      // Show error toast
      setToastMessage(t('send_message_error'));
      setShowErrorToast(true);

      // Hide error toast after 3 seconds
      setTimeout(() => {
        setShowErrorToast(false);
      }, 3000);
    }
  };

  const goBack = () => navigate(-1);

  // Show loading while checking user type or fetching animal
  if (isLoadingUserType || isGettingAnimal) {
    return (
      <div className="from-base-100 to-base-200 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/80">{t('loading_cat_details')}</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="from-base-100 to-base-200 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <div className="bg-base-100 max-w-md rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-base-content mb-4 text-2xl font-bold">
            {t('cat_not_found')}
          </h2>
          <p className="text-base-content/80 mb-6">{t('cat_not_found_desc')}</p>
          <button onClick={goBack} className="btn btn-primary gap-2">
            <IoArrowBack className="size-5" />
            {t('back_btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="from-base-100 to-base-200 min-h-screen bg-gradient-to-br p-4 md:p-8">
      {/* Success Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success animate-fade-in-up shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">
                  {toastMessage || t('message_sent')}
                </h3>
                <p className="text-sm">{t('message_sent_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast Notification */}
      {showErrorToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error animate-fade-in-up shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">
                  {toastMessage || t('send_message_error')}
                </h3>
                <p className="text-sm">{t('send_message_error_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mx-auto mb-6 max-w-7xl">
        <button
          onClick={goBack}
          className="btn btn-ghost text-base-content/80 hover:text-base-content gap-2 transition-colors"
        >
          <IoArrowBack className="size-5" />
          {t('back_btn')}
        </button>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Photos */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div
                className="from-primary/10 to-secondary/10 relative h-64 overflow-hidden bg-gradient-to-br md:h-80 lg:h-96"
                onMouseEnter={() => setHoveredPhotoIndex(0)}
                onMouseLeave={() => setHoveredPhotoIndex(null)}
              >
                <img
                  src={
                    animal.animalPhotos.length > 0
                      ? animal.animalPhotos[0].photoUrl
                      : defaultCatPic
                  }
                  alt={animal.name}
                  className={`h-full w-full object-cover transition-all duration-500 ${hoveredPhotoIndex === 0 ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="badge badge-primary">
                    {t('featured_photo')}
                  </span>
                </div>
              </div>
            </div>

            {animal.animalPhotos.length > 1 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {animal.animalPhotos.slice(1).map(({ photoUrl }, index) => (
                  <div
                    key={index}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg"
                    onMouseEnter={() => setHoveredPhotoIndex(index + 1)}
                    onMouseLeave={() => setHoveredPhotoIndex(null)}
                  >
                    <div className="from-base-300 to-base-400 aspect-square overflow-hidden bg-gradient-to-br">
                      <img
                        src={photoUrl}
                        alt={`${animal.name} photo ${index + 2}`}
                        className={`h-full w-full object-cover transition-all duration-500 ${hoveredPhotoIndex === index + 1 ? 'scale-125' : 'scale-100'}`}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Cat Details */}
          <div className="space-y-6">
            {/* Header with Name and Actions */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h1 className="text-base-content font-serif text-4xl font-bold md:text-5xl">
                  {animal.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`badge ${animal.gender === 'Male' ? 'badge-info' : 'badge-secondary'} gap-1`}
                  >
                    {animal.gender === 'Male' ? (
                      <TbGenderMale className="size-4" />
                    ) : (
                      <TbGenderFemale className="size-4" />
                    )}
                    {animal.gender}
                  </span>
                  <span className="badge badge-outline">
                    {getAgeDisplay(animal.ageInWeeks, t)}
                  </span>
                  <span
                    className={`badge ${animal.neutered ? 'badge-success' : 'badge-warning'}`}
                  >
                    {animal.neutered ? t('neutered') : t('not_neutered')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(true)}
                className="btn btn-primary btn-lg gap-2 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <TbMessageCircle className="size-6" />
                {t('message_owner')}
              </button>
            </div>

            {/* Description Card */}
            <div className="card bg-base-100 overflow-hidden rounded-3xl shadow-xl">
              <div className="card-body">
                <h2 className="text-base-content card-title text-2xl font-bold">
                  {t('about_cat', { name: animal.name })}
                </h2>
                <p className="text-base-content/80 mt-2 text-lg leading-relaxed">
                  {animal.description}
                </p>
                <div className="divider my-4"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <TbGenderMale className="text-primary size-5" />
                      </div>
                      <div>
                        <p className="text-base-content/70 text-sm">
                          {t('gender')}
                        </p>
                        <p className="text-base-content font-semibold">
                          {animal.gender}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-secondary size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base-content/70 text-sm">
                          {t('age_label')}
                        </p>
                        <p className="text-base-content font-semibold">
                          {getAgeDisplay(animal.ageInWeeks, t)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-success/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-success size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base-content/70 text-sm">
                          {t('neutered_status_label')}
                        </p>
                        <p className="text-base-content font-semibold">
                          {animal.neutered
                            ? t('yes_neutered')
                            : t('not_yet_neutered')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-info/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-info size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base-content/70 text-sm">
                          {t('photos_count_label')}
                        </p>
                        <p className="text-base-content font-semibold">
                          {animal.animalPhotos.length === 0
                            ? t('no_photos')
                            : animal.animalPhotos.length === 1
                              ? `1 ${t('photo_lowercase')}`
                              : `${animal.animalPhotos.length} ${t('photos_lowercase')}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Adoption Tips */}
            <div className="card from-primary/5 to-secondary/5 overflow-hidden rounded-3xl bg-gradient-to-br shadow-lg">
              <div className="card-body">
                <h3 className="text-base-content card-title text-xl font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary mr-2 size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t('adoption_tips')}
                </h3>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <span className="text-base-content/80">
                      {t('adoption_tip_1', { name: animal.name })}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <span className="text-base-content/80">
                      {t('adoption_tip_2')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-primary mt-2 h-2 w-2 rounded-full"></div>
                    <span className="text-base-content/80">
                      {t('adoption_tip_3', { name: animal.name })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Chat Dialog */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="modal modal-open">
            <div className="modal-box animate-scale-in max-w-md overflow-hidden p-0 shadow-2xl">
              <div className="from-primary to-secondary bg-gradient-to-r p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TbMessageCircle className="size-8" />
                    <div>
                      <h3 className="text-2xl font-bold">
                        {t('message_owner')}
                      </h3>
                      <p className="text-primary-content/80">
                        {t('send_message_about', { name: animal.name })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="btn btn-circle btn-ghost btn-sm text-white hover:bg-white/20"
                  >
                    <TbX className="size-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        {t('your_message')}
                      </span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-32 resize-none"
                      placeholder={t('message_placeholder', {
                        name: animal.name
                      })}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="label">
                      <span className="label-text-alt text-base-content/70">
                        {t('characters_count', { count: message.length })}
                      </span>
                    </div>
                  </div>

                  <div className="text-base-content/70 flex items-center gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{t('message_will_be_sent')}</span>
                  </div>

                  <div className="modal-action">
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="btn btn-ghost"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isInitiatingConversation}
                      className="btn btn-primary gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isInitiatingConversation ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          {t('sending')}
                        </>
                      ) : (
                        <>
                          <TbSend className="size-5" />
                          {t('send_message')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
