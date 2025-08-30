import { Link } from 'react-router';
import { MdEmail } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { FaTransgenderAlt } from 'react-icons/fa';
import { FaRegCalendar } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useNavigationStore } from '../../../stores/navigation-store';
import type { UserProfileData } from '../types/UserProfileData';
import { getAgeFromDateOfBirth } from '../utils/getAgeFromDateOfBirth';
import PhoneNumberIcon from '../../../assets/phone_number_icon.svg?react';
import type { FormChangeEvent } from '../types/FormChangeEvent';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { t } = useTranslation();

  const setNavigationColor = useNavigationStore(
    (state) => state.setNavigationColor
  );
  const resetNavigationColor = useNavigationStore(
    (state) => state.resetNavigationColor
  );

  useEffect(() => {
    setNavigationColor('transparent');
    return () => resetNavigationColor();
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [userProfileData, setUserProfileData] =
    useState<UserProfileData | null>({
      displayName: 'Leah Johnson',
      email: 'leahj@gmail.com',
      phoneNumber: '+1 (555) 123-4567',
      gender: 'Woman',
      dateOfBirth: '08/27/1997',
      bio: "Hi! I'm Leah, a mom of 6 adorable cats. My cat Luna had 5 kittens and I am looking for loving homes for one of them. They are still little babies so they will need a lot of care and attention."
    });

  const onProfileDataChange = (e: FormChangeEvent) => {
    if (!userProfileData) return;
    setUserProfileData({
      ...userProfileData,
      [e.target.name]: e.target.value ?? ''
    });
  };

  const getAgeText = (): string => {
    const noAgeString = t('please_enter_your_age');
    if (!userProfileData) return noAgeString;
    const age = getAgeFromDateOfBirth(userProfileData?.dateOfBirth);
    return age >= 0 ? `${age} ${t('years_old')}` : noAgeString;
  };

  const handleSave = () => {
    if (userProfileData) {
      setUserProfileData({
        ...userProfileData,
        gender: t(userProfileData.gender, { lng: 'en' })
      });
    }

    console.log(userProfileData);
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="bg-purple-gradient -mt-16 flex h-screen w-screen justify-center bg-cover bg-center">
      <div className="flex w-full flex-row items-center justify-center">
        <div className="h-min max-h-[600px] max-w-[40%] self-center rounded-2xl bg-white p-2 text-center opacity-75 shadow-2xl md:p-12 lg:text-left">
          <div className="bg-purple-gradient mx-auto -mt-16 block h-48 w-48 rounded-full bg-cover bg-center shadow-xl lg:hidden"></div>

          {!isEditMode && (
            <h1 className="pt-8 text-3xl font-bold text-black lg:pt-0">
              {!userProfileData || userProfileData.displayName.trim().length < 1
                ? t('enter_your_name')
                : userProfileData.displayName}
            </h1>
          )}
          {isEditMode && (
            <input
              value={userProfileData?.displayName}
              name="displayName"
              className="w-4/5 pt-8 text-3xl font-bold text-black active:border-indigo-500 lg:pt-0"
            />
          )}

          <div className="mx-auto w-4/5 border-b-2 border-indigo-500 pt-3 opacity-25 lg:mx-0"></div>
          <p className="flex items-center justify-center gap-x-2 pt-4 font-semibold text-black lg:justify-start">
            <MdEmail
              className={`${isEditMode ? 'mr-3 size-8' : 'size-5'} text-indigo-500`}
            />{' '}
            {userProfileData?.email}
          </p>

          {!isEditMode && (
            <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
              <IoPhonePortrait className="size-5 text-indigo-500" />
              {!userProfileData || userProfileData.phoneNumber.trim().length < 1
                ? t('please_enter_a_phone_number')
                : userProfileData.phoneNumber}
            </p>
          )}

          {isEditMode && (
            <div className="mt-4 flex flex-row">
              <IoPhonePortrait className="size-8 self-center text-indigo-500" />
              <PhoneNumberIcon />
              <input
                name="phoneNumber"
                type="tel"
                className="input-md rounded-lg border-pink-300 bg-indigo-500 p-2 tabular-nums placeholder:text-white"
                required
                placeholder={t('phone')}
                pattern="[0-9]*"
                minLength={10}
                maxLength={10}
                title="Must be 10 digits"
                onChange={onProfileDataChange}
              />
              <p className="validator-hint">{t('must_be_10_digits')}</p>
            </div>
          )}

          {!isEditMode && (
            <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
              <FaTransgenderAlt className="size-5 text-indigo-500" />
              {!userProfileData || userProfileData.gender.trim().length < 1
                ? t('please_add_your_gender')
                : t(userProfileData.gender)}
            </p>
          )}
          {isEditMode && (
            <div className="mt-4 flex flex-row gap-x-4.5">
              <FaTransgenderAlt className="size-8 self-center text-indigo-500" />
              <select
                name="gender"
                defaultValue={userProfileData?.gender ?? t('Man')}
                className="select-md select-ghost rounded-lg bg-indigo-500 p-2"
                onChange={onProfileDataChange}
              >
                <option>{t('Man')}</option>
                <option>{t('Woman')}</option>
              </select>
            </div>
          )}

          {!isEditMode && (
            <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
              <FaRegCalendar className="size-5 text-indigo-500" />
              {getAgeText()}
            </p>
          )}

          {isEditMode && (
            <div className="mt-4 flex flex-row gap-x-4.5">
              <FaRegCalendar className="size-8 self-center text-indigo-500" />
              <input
                type="date"
                name="dateOfBirth"
                className="input-md rounded-lg bg-indigo-500 p-2"
              />
            </div>
          )}

          {!isEditMode && (
            <p className="max-w-[70%] pt-5 text-sm text-wrap text-black">
              {!userProfileData || userProfileData.bio.trim().length < 1
                ? 'Please enter a bio'
                : userProfileData.bio}
            </p>
          )}
          {isEditMode && (
            <div className="mt-8">
              <textarea
                name="bio"
                className="textarea w-lg rounded-lg bg-indigo-500"
                placeholder="Bio"
                onChange={onProfileDataChange}
                value={userProfileData?.bio}
              ></textarea>
            </div>
          )}

          {!isEditMode && (
            <div className="pt-6 pb-8">
              <button
                className="rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-900"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {t('edit')}
              </button>
            </div>
          )}
          {isEditMode && (
            <div className="pt-6 pb-8">
              <button
                className="rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-900"
                onClick={handleSave}
              >
                {t('save')}
              </button>
            </div>
          )}

          <div className="mx-auto flex w-4/5 flex-wrap items-center justify-between pb-16 lg:w-full lg:pb-0">
            <Link className="link" to="#">
              <span className="h-6 fill-current text-gray-600 hover:font-bold hover:text-indigo-700">
                {t('change_password')}
              </span>
            </Link>
            <Link className="link" to="#">
              <span className="h-6 fill-current text-gray-600 hover:font-bold hover:text-indigo-700">
                {t('become_an_adopter')}
              </span>
            </Link>
            <Link className="link" to="#">
              <span className="h-6 fill-current text-red-600 hover:font-bold">
                {t('delete_account')}
              </span>
            </Link>
          </div>
        </div>
        <div className="h-min max-w-[40%] rounded-2xl shadow-2xl/50">
          <img
            src="https://images.unsplash.com/photo-1535982368253-05d640fe0755?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="max-h-[550px] w-auto self-center rounded-lg shadow-2xl/50"
          />
        </div>
      </div>
    </div>
  );
}
