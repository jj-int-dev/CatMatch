import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import { HiCheckCircle } from 'react-icons/hi';
import type { GetUserProfileResponse } from '../types/GetUserProfileResponse';
import useUpdateUserType from '../hooks/useUpdateUserType';
import { useAuthStore } from '../../../stores/auth-store';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UserConversionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserType: string | null;
}

export default function UserConversionDialog({
  isOpen,
  onClose,
  currentUserType
}: UserConversionDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const updateUserTypeMutation = useUpdateUserType();
  const userSession = useAuthStore((state) => state.session);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetUserType, setTargetUserType] = useState<string>(
    currentUserType === 'Adopter' ? 'Rehomer' : 'Adopter'
  );

  const handleConfirmConversion = async () => {
    setErrorMessage(null);
    try {
      await updateUserTypeMutation.mutateAsync(targetUserType);
      queryClient.setQueryData(
        ['user-profile', userSession?.user.id],
        (profileData: GetUserProfileResponse) => {
          return { ...profileData, userType: targetUserType };
        }
      );
      onClose();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : t('switch_user_type_error');
      setErrorMessage(errorMsg);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    updateUserTypeMutation.reset();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // User type selection for new users
  if (currentUserType == null) {
    return (
      <dialog open={isOpen} className="modal">
        <div className="modal-box bg-base-100 max-w-3xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
              onClick={handleClose}
              type="button"
            >
              ✕
            </button>
          </form>

          <div className="flex flex-col items-center py-4">
            {/* Welcome Icon */}
            <div className="bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
              <HiCheckCircle className="text-primary h-10 w-10" />
            </div>

            <h3 className="text-base-content mb-3 text-center text-3xl font-bold">
              {t('set_user_type')}
            </h3>

            <p className="text-base-content/70 mb-8 max-w-lg text-center">
              {t('choose_user_type_desc')}
            </p>

            {/* User Type Selection Cards */}
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {/* Adopter Card */}
              <div
                className={`card cursor-pointer border-2 transition-all duration-300 ${
                  targetUserType === 'Adopter'
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => setTargetUserType('Adopter')}
              >
                <div className="card-body">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base-content text-xl font-bold">
                      {t('adopter', 'Adopter')}
                    </h4>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        targetUserType === 'Adopter'
                          ? 'border-primary bg-primary'
                          : 'border-base-300'
                      }`}
                    >
                      {targetUserType === 'Adopter' && (
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <p className="text-base-content/80 mb-4">
                    {t(
                      'adopter_desc',
                      'Browse cats and connect with rehomers to find your perfect companion.'
                    )}
                  </p>

                  <ul className="text-base-content/70 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t(
                          'adopter_feature_1',
                          'Browse available cats in your area'
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t(
                          'adopter_feature_2',
                          'Message rehomers to learn more'
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t('adopter_feature_3', 'Find your perfect match')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rehomer Card */}
              <div
                className={`card cursor-pointer border-2 transition-all duration-300 ${
                  targetUserType === 'Rehomer'
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => setTargetUserType('Rehomer')}
              >
                <div className="card-body">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base-content text-xl font-bold">
                      {t('rehomer', 'Rehomer')}
                    </h4>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        targetUserType === 'Rehomer'
                          ? 'border-primary bg-primary'
                          : 'border-base-300'
                      }`}
                    >
                      {targetUserType === 'Rehomer' && (
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <p className="text-base-content/80 mb-4">
                    {t(
                      'rehomer_desc',
                      'Post cats for adoption and connect with potential adopters.'
                    )}
                  </p>

                  <ul className="text-base-content/70 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t(
                          'rehomer_feature_1',
                          'Create listings for cats needing homes'
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t('rehomer_feature_2', 'Chat with potential adopters')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <HiCheckCircle className="text-success mt-0.5 size-5 flex-shrink-0" />
                      <span>
                        {t('rehomer_feature_3', 'Find loving homes for cats')}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="alert alert-error mt-6 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="btn btn-ghost sm:flex-none"
                onClick={handleClose}
                type="button"
              >
                {t('cancel')}
              </button>

              <button
                className="btn btn-primary gap-2 sm:flex-none"
                onClick={handleConfirmConversion}
                type="button"
                disabled={!targetUserType}
              >
                {t('continue_as', { userType: targetUserType })}
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={handleClose}>close</button>
        </form>
      </dialog>
    );
  }

  // User type conversion for existing users
  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box bg-base-100 max-w-md">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
            onClick={handleClose}
            type="button"
            disabled={updateUserTypeMutation.isPending}
          >
            ✕
          </button>
        </form>

        <div className="flex flex-col items-center py-4">
          {/* Warning Icon */}
          <div className="bg-warning/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <FaExclamationTriangle className="text-warning h-10 w-10" />
          </div>

          <h3 className="text-base-content mb-4 text-center text-2xl font-bold">
            {currentUserType === 'Rehomer'
              ? t('adopter_confirmation_title')
              : t('rehomer_confirmation_title')}
          </h3>

          {updateUserTypeMutation.isPending ? (
            <div className="my-6 flex flex-col items-center">
              <FaSpinner className="text-primary mb-4 h-12 w-12 animate-spin" />
              <p className="text-base-content/80 text-center">
                {t(
                  'account_conversion_message',
                  'Your account conversion is in process. This may take a moment...'
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="alert mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 flex-shrink-0"
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
                <div className="text-sm">
                  <p className="text-base-content/80">
                    {currentUserType === 'Rehomer'
                      ? t('adopter_confirmation_desc')
                      : t('rehomer_confirmation_desc')}
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-error mb-4 w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="mt-6 flex w-full flex-col gap-3">
                <button
                  className="btn btn-warning gap-2"
                  onClick={handleConfirmConversion}
                  type="button"
                  disabled={updateUserTypeMutation.isPending}
                >
                  {currentUserType === 'Rehomer'
                    ? t('become_an_adopter')
                    : t('become_a_rehomer')}
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={handleClose}
                  type="button"
                  disabled={updateUserTypeMutation.isPending}
                >
                  {t('cancel')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button
          onClick={handleClose}
          disabled={updateUserTypeMutation.isPending}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
