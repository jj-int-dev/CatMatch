import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
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
import type { GetUserProfilePictureAndTypeResponse } from '../../../types/GetUserProfilePictureAndTypeResponse';
import defaultProfilePic from '../../../assets/default_profile_pic.jpg';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { PiUploadSimple } from 'react-icons/pi';
import type { GetUserProfileResponse } from '../types/GetUserProfileResponse';
import ErrorToast from '../../../components/toasts/ErrorToast';
import getUniqueImageUrl from '../../../utils/getUniqueImageUrl';
import { processImage } from '../../../utils/processImage';
import { CgAsterisk } from 'react-icons/cg';
import { openSendResetPasswordLinkDialog } from '../../../components/send-reset-password-link/SendResetPasswordLinkDialog';

export default function UserProfile() {
  const { i18n, t } = useTranslation();
  const params = useParams();
  const userId = params['userId'];
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [formValidationErrors, setFormValidationErrors] = useState<string[]>(
    []
  );
  const [imageUpdateErrors, setImageUpdateErrors] = useState<string[]>([]);

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToUserTypeSelection = () =>
    navigate(`/user-type-selection/${userId!}`);

  useEffect(() => {
    if (!userId) {
      goToLoginPage();
    } else if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      } else if (userId !== userSession?.user?.id) {
        // The currently logged in user can only access their own profile
        logUserOut().then(goToLoginPage);
      }
    }
  }, [userId, userSession, isLoadingSession]);

  // Recreate the schema whenever the language changes so that error messages are in the correct language
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
    try {
      const formData = new FormData();
      formData.append('profile_picture', newPicture);
      const { avatarUrl } = await updateUserProfilePicture(formData);
      queryClient.setQueryData(['user-profile-picture', userId], { avatarUrl });
      queryClient.setQueryData(
        ['navigation', userId],
        (oldData: GetUserProfilePictureAndTypeResponse) => {
          return { ...oldData, avatarUrl: getUniqueImageUrl(avatarUrl) };
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
    try {
      await deleteUserProfilePicture();
      queryClient.setQueryData(['user-profile-picture', userId], {
        avatarUrl: defaultProfilePic
      });
      queryClient.setQueryData(
        ['navigation', userId],
        (oldData: GetUserProfilePictureAndTypeResponse) => {
          return { ...oldData, avatarUrl: defaultProfilePic };
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
  // date of birth must be before today
  const dateOfBirthLimit = maxDateOfBirth.toISOString().split('T')[0];

  // Show loading state while session is being loaded, profile data is being fetched/updated
  // or if the user profile data fetch failed
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
    console.log('Saving user profile data:', formData);
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
      queryClient.setQueryData(['user-profile', userId], updatedProfileData);
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

  return (
    <div className="-mt-16 flex h-screen w-screen justify-center bg-[#f9f9f9] bg-cover bg-center px-4 pt-28">
      {showErrorToast && (
        <ErrorToast
          messages={formValidationErrors}
          onCloseToast={onCloseErrorToast}
        />
      )}
      <div className="mx-6 h-fit w-fit rounded-2xl bg-gradient-to-r from-[#b8d2f1] to-[#fdf7e1] pt-16 shadow-md sm:mx-0">
        <div className="h-full w-full bg-[#f9f9f9] px-6 py-8">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 flex flex-row gap-x-4 sm:col-span-6">
              <div className="avatar">
                <div
                  className="w-12 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                  onClick={openChooseProfilePicDialog}
                >
                  <img
                    src={
                      isLoadingUserProfilePicture ||
                      getUserProfilePictureFailed ||
                      !userProfilePictureData.avatarUrl
                        ? defaultProfilePic
                        : getUniqueImageUrl(userProfilePictureData.avatarUrl)
                    }
                  />
                </div>
              </div>
              <div
                className={`flex flex-col${userProfileData.userProfile?.displayName ? '' : 'justify-center'}`}
              >
                {userProfileData.userProfile?.displayName && (
                  <p>{userProfileData.userProfile.displayName}</p>
                )}
                <p className="text-gray-600">
                  {userProfileData.userProfile!.email}
                </p>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 sm:justify-self-end sm:text-right">
              <button
                className="btn border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                disabled={isSubmitting}
                onClick={handleSubmit(handleSave, handleProfileUpdateFailure)}
              >
                {t('save')}
              </button>
              {!userProfileData.userProfile?.userType && (
                <button
                  className="btn ml-3 border-[#36b37e] bg-[#36b37e] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                  disabled={!userProfileData.userProfile?.displayName}
                  onClick={goToUserTypeSelection}
                >
                  {t('next')}
                </button>
              )}
            </div>
          </div>
          <fieldset className="fieldset rounded-box mt-6 w-md border border-[#b8d2f1] bg-white p-4">
            <legend className="fieldset-legend text-black">
              {t('profile')}
            </legend>

            <label className="label">
              {t('display_name')}
              <CgAsterisk className="text-red-600" />
            </label>
            <input
              id="displayName"
              type="text"
              className="input w-fieldset-input-md bg-[#f9f9f9]"
              placeholder="Your name"
              {...register('displayName')}
              defaultValue={userProfileData.userProfile?.displayName ?? ''}
            />

            <label className="label">{t('date_of_birth')}</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              defaultValue={userProfileData.userProfile?.dateOfBirth ?? ''}
              max={dateOfBirthLimit}
              className="input w-fieldset-input-md bg-[#f9f9f9]"
            />

            <label className="label">{t('gender')}</label>
            <select
              id="gender"
              {...register('gender')}
              defaultValue={userProfileData.userProfile?.gender ?? ''}
              className="select w-fieldset-input-md bg-[#f9f9f9]"
            >
              <option value="" disabled hidden>
                {t('select_your_gender')}
              </option>
              <option value="Man">{t('Man')}</option>
              <option value="Woman">{t('Woman')}</option>
            </select>

            <label className="label">{t('phone_number')}</label>
            <input
              id="phoneNumber"
              {...register('phoneNumber')}
              type="tel"
              className="input w-fieldset-input-md bg-[#f9f9f9] tabular-nums"
              defaultValue={userProfileData.userProfile?.phoneNumber ?? ''}
              placeholder="+14155552671"
            />

            <label className="label">{t('bio')}</label>
            <textarea
              id="bio"
              {...register('bio')}
              className="textarea w-fieldset-input-md bg-[#f9f9f9]"
              placeholder="Bio"
              defaultValue={userProfileData.userProfile?.bio ?? ''}
            ></textarea>
          </fieldset>
          <div className="mt-6 flex flex-col max-sm:gap-y-3 sm:flex-row sm:justify-between">
            {isAuthenticatedUserSession(userSession) &&
              userSession!.user.app_metadata.provider === 'email' && (
                <button
                  className="w-full cursor-pointer underline hover:font-bold hover:text-[#4181fa] sm:w-auto"
                  onClick={openSendResetPasswordLinkDialog}
                >
                  {t('change_password')}
                </button>
              )}
            {userProfileData.userProfile?.userType && (
              <button className="w-full cursor-pointer underline hover:font-bold hover:text-[#4181fa] sm:w-auto">
                {userProfileData.userProfile.userType === 'Rehomer'
                  ? t('become_an_adopter')
                  : t('become_a_rehomer')}
              </button>
            )}
            <button className="w-full cursor-pointer text-red-600 underline hover:font-bold sm:w-auto">
              {t('delete_account')}
            </button>
          </div>
        </div>
      </div>

      <dialog id="chooseProfilePicDialog" className="modal">
        <div className="modal-box w-md bg-white">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-transparent text-black transition-colors duration-200 hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.12)] hover:text-black">
              ✕
            </button>
          </form>
          {imageUpdateErrors.length === 0 ? (
            <div className="avatar my-10 flex justify-center">
              <div className="w-36 rounded-full">
                <img
                  src={
                    isLoadingUserProfilePicture ||
                    getUserProfilePictureFailed ||
                    !userProfilePictureData.avatarUrl
                      ? defaultProfilePic
                      : getUniqueImageUrl(userProfilePictureData.avatarUrl)
                  }
                />
              </div>
            </div>
          ) : (
            <div className="my-10">
              <ul>
                {imageUpdateErrors.map((error) => (
                  <li key={error} className="text-red-600">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="modal-action">
            {imageUpdateErrors.length > 0 ? (
              <button
                className="btn btn-sm border-[#e53935] bg-[#e53935] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                onClick={cancelChooseProfilePic}
              >
                {t('close')}
              </button>
            ) : (
              !isLoadingUserProfilePicture &&
              !getUserProfilePictureFailed &&
              !!userProfilePictureData.avatarUrl &&
              userProfilePictureData.avatarUrl !== defaultProfilePic && (
                <button
                  className="btn btn-sm border-[#e53935] bg-[#e53935] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                  onClick={handleDeleteProfilePicture}
                  disabled={
                    isDeletingUserProfilePicture || isUpdatingUserProfilePicture
                  }
                >
                  <RiDeleteBin6Line /> {t('delete_user_profile_picture')}
                </button>
              )
            )}
            <button
              className="btn btn-sm border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
              onClick={openFileExplorer}
              disabled={
                isUpdatingUserProfilePicture || isDeletingUserProfilePicture
              }
            >
              <PiUploadSimple /> {t('upload_user_profile_picture')}
            </button>
          </div>
        </div>
      </dialog>
      {/*Hidden file input for profile picture upload*/}
      <input
        type="file"
        className="hidden"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        ref={fileInputRef}
        onChange={handleProfilePictureChange}
      />
    </div>
  );
}
