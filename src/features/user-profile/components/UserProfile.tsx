import { useEffect, useState, useMemo } from 'react';
import type { FormChangeEvent } from '../types/FormTypes';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import useGetUserProfile from '../hooks/useGetUserProfile';
import UserProfileSkeleton from './UserProfileSkeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserProfileFormValidator,
  type UserProfileFormSchema
} from '../validators/userProfileFormValidator';

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
  const goToLoginPage = () => navigate('/login', { replace: true });

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

  const { isPending, isError, data } = useGetUserProfile();

  // create stateful variables for the profile pic file and its preview url

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

  // Show loading state while session is being checked or profile data is being  updated
  if (isLoadingSession || isPending || isError || isSubmitting) {
    return <UserProfileSkeleton />;
  }

  const handleSave = async (formData: UserProfileFormSchema) => {
    // TODO: implement save functionality, don't forget to handle profile picture as well
    // use the safeParse method of the profile pic validator here as well
    // use setQueryData(['user-profile', userId], ...) to update the user profile data in the react-query cache after successful save
    console.log('Saving user profile data:', formData);
  };

  // TODO: implement failure handler, don't forget to pass it to handleSubmit

  // TODO: add translations for form labels and profile title

  return (
    <div className="-mt-16 flex h-screen w-screen justify-center bg-[#f9f9f9] bg-cover bg-center px-4 pt-28">
      <div className="mx-6 h-fit w-fit rounded-2xl bg-gradient-to-r from-[#b8d2f1] to-[#fdf7e1] pt-16 shadow-md sm:mx-0">
        <div className="h-full w-full bg-[#f9f9f9] px-6 py-8">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 flex flex-row gap-x-4 sm:col-span-6">
              <div className="avatar">
                <div className="w-12 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <div
                className={`flex flex-col${data.userProfile?.displayName ? '' : 'justify-center'}`}
              >
                {data.userProfile?.displayName && (
                  <p>{data.userProfile.displayName}</p>
                )}
                <p className="text-gray-600">{data.userProfile!.email}</p>
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
              {!data.userProfile?.userType && (
                <button
                  className="btn ml-3 border-[#36b37e] bg-[#36b37e] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
                  disabled={!data.userProfile?.displayName}
                >
                  {t('next')}
                </button>
              )}
            </div>
          </div>
          <fieldset className="fieldset rounded-box mt-6 w-md border border-[#b8d2f1] bg-white p-4">
            <legend className="fieldset-legend text-black">Profile</legend>

            <label className="label">Display Name</label>
            <input
              id="displayName"
              type="text"
              className="input w-fieldset-input-md bg-[#f9f9f9]"
              placeholder="Your name"
              {...register('displayName')}
              value={data.userProfile?.displayName ?? ''}
            />

            <label className="label">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              value={data.userProfile?.dateOfBirth ?? ''}
              max={dateOfBirthLimit}
              className="input w-fieldset-input-md bg-[#f9f9f9]"
            />

            <label className="label">Gender</label>
            <select
              id="gender"
              {...register('gender')}
              defaultValue={data.userProfile?.gender ?? ''}
              className="select w-fieldset-input-md bg-[#f9f9f9]"
            >
              <option value="" disabled hidden>
                {t('select_your_gender')}
              </option>
              <option value="Man">{t('Man')}</option>
              <option value="Woman">{t('woman')}</option>
            </select>

            <label className="label">Phone Number</label>
            <input
              id="phoneNumber"
              {...register('phoneNumber')}
              type="tel"
              className="input w-fieldset-input-md bg-[#f9f9f9] tabular-nums"
              value={data.userProfile?.phoneNumber ?? ''}
              placeholder="+14155552671"
            />

            <label className="label">Bio</label>
            <textarea
              id="bio"
              {...register('bio')}
              className="textarea w-fieldset-input-md bg-[#f9f9f9]"
              placeholder="Bio"
              defaultValue={data.userProfile?.bio ?? ''}
            ></textarea>
          </fieldset>
          <div className="mt-6 flex flex-col max-sm:gap-y-3 sm:flex-row sm:justify-between">
            <button className="w-full cursor-pointer underline hover:font-bold hover:text-[#4181fa] sm:w-auto">
              {t('change_password')}
            </button>
            {data.userProfile?.userType && (
              <button className="w-full cursor-pointer underline hover:font-bold hover:text-[#4181fa] sm:w-auto">
                {data.userProfile.userType === 'Rehomer'
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
    </div>
  );
}
