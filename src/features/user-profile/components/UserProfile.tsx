import { useEffect, useState, useMemo, useRef } from 'react';
import type { FormChangeEvent } from '../types/FormTypes';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useGetUserProfilePicture from '../hooks/useGetUserProfilePicture';
import UserProfileSkeleton from './UserProfileSkeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserProfileFormValidator,
  type UserProfileFormSchema
} from '../validators/userProfileFormValidator';
import {
  createNewUserProfilePictureValidator,
  type NewUserProfilePictureSchema,
  ACCEPTED_IMAGE_TYPES
} from '../validators/newUserProfilePictureValidator';
import defaultProfilePic from '../../../assets/default_profile_pic.jpg';

export default function UserProfile() {
  const { i18n, t } = useTranslation();
  const params = useParams();
  const userId = params['userId'];
  const navigate = useNavigate();
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

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToUserTypeSelection = (userId: string) =>
    navigate(`/user-type-selection/${userId}`);

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
    isPending: isLoadingUserProfile,
    isError: getUserProfileFailed,
    error: getUserProfileError,
    data: userProfileData
  } = useGetUserProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { success, data, error } = profilePicValidator.safeParse({
      profilePicture: event.target.files
    });
    if (success && data?.profilePicture) {
      // TODO: compress profile pic and create mutation to upload it. then update react-query cache and close dialog
    } else if (error?.issues?.length) {
      // TODO: show validation errors in dialog.
    }
  };

  // TODO: handle delete profile picture functionality. will probably need a mutation for that too

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset
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
    isSubmitting
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

  const openFileExplorer = () => {
    // Opens the file explorer
    fileInputRef.current?.click();
  };

  const handleSave = async (formData: UserProfileFormSchema) => {
    // TODO: implement save functionality
    // use setQueryData(['user-profile', userId], ...) to update the user profile data in the react-query cache after successful save
    console.log('Saving user profile data:', formData);
  };

  // TODO: implement failure handler, don't forget to pass it to handleSubmit

  return (
    <div className="-mt-16 flex h-screen w-screen justify-center bg-[#f9f9f9] bg-cover bg-center px-4 pt-28">
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
                        : userProfilePictureData.avatarUrl
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
                onClick={handleSubmit(handleSave)}
              >
                {t('save')}
              </button>
              {!userProfileData.userProfile?.userType && (
                <button
                  className="btn ml-3 border-[#36b37e] bg-[#36b37e] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                  disabled={!userProfileData.userProfile?.displayName}
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

            <label className="label">{t('display_name')}</label>
            <input
              id="displayName"
              type="text"
              className="input w-fieldset-input-md bg-[#f9f9f9]"
              placeholder="Your name"
              {...register('displayName')}
              value={userProfileData.userProfile?.displayName ?? ''}
            />

            <label className="label">{t('date_of_birth')}</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              value={userProfileData.userProfile?.dateOfBirth ?? ''}
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
              <option value="Woman">{t('woman')}</option>
            </select>

            <label className="label">{t('phone_number')}</label>
            <input
              id="phoneNumber"
              {...register('phoneNumber')}
              type="tel"
              className="input w-fieldset-input-md bg-[#f9f9f9] tabular-nums"
              value={userProfileData.userProfile?.phoneNumber ?? ''}
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
            <button className="w-full cursor-pointer underline hover:font-bold hover:text-[#4181fa] sm:w-auto">
              {t('change_password')}
            </button>
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
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
              ✕
            </button>
          </form>
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img
                src={
                  isLoadingUserProfilePicture ||
                  getUserProfilePictureFailed ||
                  !userProfilePictureData.avatarUrl
                    ? defaultProfilePic
                    : userProfilePictureData.avatarUrl
                }
              />
            </div>
          </div>
          <div className="modal-action">
            {!isLoadingUserProfilePicture &&
              !getUserProfilePictureFailed &&
              !!userProfilePictureData.avatarUrl && (
                <button className="btn border-[#e53935] bg-[#e53935] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm">
                  {t('delete_user_profile_picture')}
                </button>
              )}
            <button
              className="btn border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
              onClick={openFileExplorer}
            >
              {t('upload_user_profile_picture')}
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
