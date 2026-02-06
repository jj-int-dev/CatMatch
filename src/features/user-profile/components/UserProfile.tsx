import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useUpdateUserProfile from '../hooks/useUpdateUserProfile';
import useGetUserProfilePicture from '../hooks/useGetUserProfilePicture';
import useUpdateUserProfilePicture from '../hooks/useUpdateUserProfilePicture';
import useDeleteUserProfilePicture from '../hooks/useDeleteUserProfilePicture';
import UserProfileSkeleton from './UserProfileSkeleton';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserProfileFormValidator,
  type UserProfileFormSchema
} from '../validators/userProfileFormValidator';
import {
  createNewUserProfilePictureValidator,
  ACCEPTED_IMAGE_TYPES
} from '../validators/newUserProfilePictureValidator';
import defaultProfilePic from '../../../assets/default_profile_pic.webp';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { PiUploadSimple } from 'react-icons/pi';
import { HiUser, HiMail } from 'react-icons/hi';
import type { GetUserProfileResponse } from '../types/GetUserProfileResponse';
import ErrorToast from '../../../components/toasts/ErrorToast';
import getUniqueImageUrl from '../../../utils/getUniqueImageUrl';
import { processImage } from '../../../utils/processImage';
import { CgAsterisk } from 'react-icons/cg';
import { useSendResetPasswordLinkStore } from '../../../components/send-reset-password-link/stores/send-reset-password-link-store';
import AccountDeletionDialog from './AccountDeletionDialog';
import UserConversionDialog from './UserConversionDialog';

export default function UserProfile() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );
  const [imageUpdateErrors, setImageUpdateErrors] = useState<string[]>([]);
  const [showAccountDeletionDialog, setShowAccountDeletionDialog] =
    useState(false);
  const [showUserConversionDialog, setShowUserConversionDialog] =
    useState(false);

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToNextPageBasedOnUserType = () => {
    if (userProfileData?.userProfile.userType === 'Rehomer') {
      navigate(`/rehomer/dashboard`);
    } else if (userProfileData?.userProfile.userType === 'Adopter') {
      navigate('/discovery');
    }
  };

  useEffect(() => {
    if (!isLoadingSession && !isAuthenticatedUserSession(userSession)) {
      goToLoginPage();
    }
  }, [userSession, isLoadingSession]);

  const formValidator = useMemo(
    () => createUserProfileFormValidator(),
    [i18n.language]
  );
  const profilePicValidator = useMemo(
    () => createNewUserProfilePictureValidator(),
    [i18n.language]
  );

  const {
    isPending: isLoadingUserProfilePicture,
    isError: getUserProfilePictureFailed,
    data: userProfilePictureData
  } = useGetUserProfilePicture();
  const {
    isPending: isUpdatingUserProfilePicture,
    mutateAsync: updateUserProfilePicture
  } = useUpdateUserProfilePicture();
  const {
    isPending: isDeletingUserProfilePicture,
    mutateAsync: deleteUserProfilePicture
  } = useDeleteUserProfilePicture();
  const {
    isPending: isLoadingUserProfile,
    isError: getUserProfileFailed,
    error: getUserProfileError,
    data: userProfileData
  } = useGetUserProfile();
  const { isPending: isUpdatingUserProfile, mutateAsync: updateUserProfile } =
    useUpdateUserProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveNewProfilePicture = async (newPicture: File) => {
    if (!isAuthenticatedUserSession(userSession)) return;

    try {
      const formData = new FormData();
      formData.append('profile_picture', newPicture);
      const { avatarUrl } = await updateUserProfilePicture(formData);
      queryClient.setQueryData(['user-profile-picture', userSession!.user.id], {
        avatarUrl
      });
      queryClient.setQueryData(
        ['profile-picture', userSession!.user.id],
        () => {
          return { avatarUrl: getUniqueImageUrl(avatarUrl) };
        }
      );
      if (imageUpdateErrors.length === 0) {
        closeChooseProfilePicDialog();
      }
    } catch (error) {
      setImageUpdateErrors([(error as Error).message]);
    }
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { success, data, error } = profilePicValidator.safeParse({
      profilePicture: event.target.files
    });
    if (success && data?.profilePicture) {
      setImageUpdateErrors([]);
      const imageProcessingResult = await processImage(data.profilePicture);
      if (imageProcessingResult.success) {
        await saveNewProfilePicture(imageProcessingResult.image!);
      } else {
        setImageUpdateErrors([t('update_user_profile_picture_error')]);
      }
    } else if (error?.issues?.length) {
      setImageUpdateErrors(error.issues.map((err) => err.message));
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!isAuthenticatedUserSession(userSession)) return;

    try {
      await deleteUserProfilePicture();
      queryClient.setQueryData(['user-profile-picture', userSession!.user.id], {
        avatarUrl: defaultProfilePic
      });
      queryClient.setQueryData(
        ['profile-picture', userSession!.user.id],
        () => {
          return { avatarUrl: getUniqueImageUrl(defaultProfilePic) };
        }
      );
      setImageUpdateErrors([]);
      closeChooseProfilePicDialog();
    } catch (error) {
      setImageUpdateErrors([(error as Error).message]);
    }
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting }
  } = useForm<UserProfileFormSchema>({
    resolver: zodResolver(formValidator)
  });
  const maxDateOfBirth = new Date();
  maxDateOfBirth.setDate(maxDateOfBirth.getDate() - 1);
  const dateOfBirthLimit = maxDateOfBirth.toISOString().split('T')[0];

  if (
    isLoadingSession ||
    isLoadingUserProfile ||
    getUserProfileFailed ||
    isSubmitting ||
    isUpdatingUserProfile
  ) {
    return (
      <UserProfileSkeleton
        {...(getUserProfileFailed
          ? { errorMessages: [getUserProfileError!.message] }
          : {})}
      />
    );
  }

  const openChooseProfilePicDialog = () =>
    (
      document.getElementById(
        'chooseProfilePicDialog'
      ) as HTMLDialogElement | null
    )?.showModal();

  const closeChooseProfilePicDialog = () =>
    (
      document.getElementById(
        'chooseProfilePicDialog'
      ) as HTMLDialogElement | null
    )?.close();

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (formData: UserProfileFormSchema) => {
    if (!isAuthenticatedUserSession(userSession)) return;

    try {
      const { userProfile: updatedProfile } = await updateUserProfile(formData);
      const updatedProfileData: GetUserProfileResponse = {
        userProfile: {
          email: updatedProfile.email,
          displayName: updatedProfile.displayName,
          dateOfBirth: updatedProfile.dateOfBirth,
          phoneNumber: updatedProfile.phoneNumber,
          gender: updatedProfile.gender,
          bio: updatedProfile.bio,
          userType: updatedProfile.userType
        }
      };
      queryClient.setQueryData(
        ['user-profile', userSession!.user.id],
        updatedProfileData
      );
      clearErrors();
      setShowErrorToast(false);
      setFormValidationErrors([]);
    } catch (error) {
      setFormValidationErrors([(error as Error).message]);
    }
  };

  const handleProfileUpdateFailure = (
    formErrors: FieldErrors<UserProfileFormSchema>
  ) => {
    const errorMsgs: string[] = [];

    if (formErrors.displayName?.message != null) {
      errorMsgs.push(formErrors.displayName.message);
    }
    if (formErrors.dateOfBirth?.message != null) {
      errorMsgs.push(formErrors.dateOfBirth.message);
    }
    if (formErrors.phoneNumber?.message != null) {
      errorMsgs.push(formErrors.phoneNumber.message);
    }
    if (formErrors.gender?.message != null) {
      errorMsgs.push(formErrors.gender.message);
    }
    if (formErrors.bio?.message != null) {
      errorMsgs.push(formErrors.bio.message);
    }

    setFormValidationErrors(errorMsgs);
    setShowErrorToast(errorMsgs.length > 0);
  };

  const onCloseErrorToast = () => {
    clearErrors();
    setShowErrorToast(false);
    setFormValidationErrors([]);
  };

  const cancelChooseProfilePic = () => {
    setImageUpdateErrors([]);
    closeChooseProfilePicDialog();
  };

  const { setShowSendResetPasswordLinkDialog } =
    useSendResetPasswordLinkStore();

  return (
    <div className="from-base-100 to-base-200 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      {showErrorToast && (
        <ErrorToast
          messages={formValidationErrors}
          onCloseToast={onCloseErrorToast}
        />
      )}

      <div className="card bg-base-100 w-full max-w-4xl shadow-xl">
        <div className="card-body">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="avatar cursor-pointer"
                onClick={openChooseProfilePicDialog}
              >
                <div className="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-2 transition-all hover:ring-offset-4">
                  <img
                    src={
                      isLoadingUserProfilePicture ||
                      getUserProfilePictureFailed ||
                      !userProfilePictureData.avatarUrl
                        ? defaultProfilePic
                        : getUniqueImageUrl(userProfilePictureData.avatarUrl)
                    }
                    alt="Profile"
                  />
                </div>
              </div>
              <div>
                {!!userProfileData.userProfile.displayName && (
                  <h2 className="text-base-content text-2xl font-bold">
                    {userProfileData.userProfile.displayName}
                  </h2>
                )}
                <p className="text-base-content/70 flex items-center gap-2">
                  <HiMail className="size-4" />
                  {userProfileData.userProfile.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-primary"
                disabled={
                  isSubmitting || !isAuthenticatedUserSession(userSession)
                }
                onClick={handleSubmit(handleSave, handleProfileUpdateFailure)}
              >
                {t('save')}
              </button>
              <button
                className="btn btn-success"
                disabled={
                  !userProfileData.userProfile.displayName ||
                  !isAuthenticatedUserSession(userSession) ||
                  !userProfileData.userProfile.userType
                }
                onClick={goToNextPageBasedOnUserType}
              >
                {t('next')}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="divider"></div>

          <div className="space-y-4">
            <h3 className="text-base-content flex items-center gap-2 text-xl font-semibold">
              <HiUser className="size-6" />
              {t('profile')}
            </h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  {t('display_name')}
                  <CgAsterisk className="text-error size-3" />
                </span>
              </label>
              <input
                id="displayName"
                type="text"
                className="input input-bordered"
                placeholder="Your name"
                {...register('displayName')}
                defaultValue={userProfileData.userProfile.displayName ?? ''}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('date_of_birth')}</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  defaultValue={userProfileData.userProfile.dateOfBirth ?? ''}
                  max={dateOfBirthLimit}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('gender')}</span>
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  defaultValue={userProfileData.userProfile.gender ?? ''}
                  className="select select-bordered"
                >
                  <option value="" disabled hidden>
                    {t('select_your_gender')}
                  </option>
                  <option value="Man">{t('man')}</option>
                  <option value="Woman">{t('woman')}</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('phone_number')}</span>
              </label>
              <input
                id="phoneNumber"
                {...register('phoneNumber')}
                type="tel"
                className="input input-bordered tabular-nums"
                defaultValue={userProfileData.userProfile.phoneNumber ?? ''}
                placeholder="+14155552671"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t('bio')}</span>
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                className="textarea textarea-bordered h-24"
                placeholder="Bio"
                defaultValue={userProfileData.userProfile.bio ?? ''}
              ></textarea>
            </div>
          </div>

          {/* Action Links */}
          <div className="divider"></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {isAuthenticatedUserSession(userSession) &&
              userSession!.user.app_metadata.provider === 'email' && (
                <button
                  className="link link-primary"
                  onClick={() => setShowSendResetPasswordLinkDialog(true)}
                >
                  {t('change_password')}
                </button>
              )}
            <button
              className="link link-primary"
              onClick={() => setShowUserConversionDialog(true)}
            >
              {t(
                userProfileData.userProfile.userType == null
                  ? 'set_user_type'
                  : userProfileData.userProfile.userType === 'Rehomer'
                    ? 'become_an_adopter'
                    : 'become_a_rehomer'
              )}
            </button>
            <button
              className="link link-error"
              onClick={() => setShowAccountDeletionDialog(true)}
            >
              {t('delete_account')}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Picture Dialog */}
      <dialog id="chooseProfilePicDialog" className="modal">
        <div className="modal-box bg-base-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
              ✕
            </button>
          </form>

          <h3 className="text-base-content mb-4 text-lg font-bold">
            {t('profile_picture', 'Profile Picture')}
          </h3>

          {imageUpdateErrors.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
                  <img
                    src={
                      isLoadingUserProfilePicture ||
                      getUserProfilePictureFailed ||
                      !userProfilePictureData.avatarUrl
                        ? defaultProfilePic
                        : getUniqueImageUrl(userProfilePictureData.avatarUrl)
                    }
                    alt="Profile"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-2">
                <button
                  className="btn btn-primary gap-2"
                  onClick={openFileExplorer}
                  disabled={
                    isUpdatingUserProfilePicture || isDeletingUserProfilePicture
                  }
                >
                  <PiUploadSimple className="size-5" />
                  {t('upload_user_profile_picture')}
                </button>

                {!isLoadingUserProfilePicture &&
                  !getUserProfilePictureFailed &&
                  !!userProfilePictureData.avatarUrl &&
                  userProfilePictureData.avatarUrl !== defaultProfilePic && (
                    <button
                      className="btn btn-error btn-outline gap-2"
                      onClick={handleDeleteProfilePicture}
                      disabled={
                        isDeletingUserProfilePicture ||
                        isUpdatingUserProfilePicture
                      }
                    >
                      <RiDeleteBin6Line className="size-5" />
                      {t('delete_user_profile_picture')}
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="alert alert-error">
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
              <div>
                {imageUpdateErrors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            </div>
          )}

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={cancelChooseProfilePic}>
              {t('close')}
            </button>
          </div>
        </div>
      </dialog>

      {/* Hidden file input */}
      <input
        type="file"
        className="hidden"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        ref={fileInputRef}
        onChange={handleProfilePictureChange}
      />

      {/* Dialogs */}
      <AccountDeletionDialog
        isOpen={showAccountDeletionDialog}
        onClose={() => setShowAccountDeletionDialog(false)}
      />
      <UserConversionDialog
        isOpen={showUserConversionDialog}
        onClose={() => setShowUserConversionDialog(false)}
        currentUserType={userProfileData.userProfile.userType}
      />
    </div>
  );
}
