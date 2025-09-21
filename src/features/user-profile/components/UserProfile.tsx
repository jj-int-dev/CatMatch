import { useEffect, useState } from 'react';
import type { FormChangeEvent } from '../types/FormTypes';
import { useTranslation } from 'react-i18next';
import { useSetNavigationColor } from '../../../hooks/useSetNavigationColor';
import DisplayName from './DisplayName';
import Email from './Email';
import PhoneNumber from './PhoneNumber';
import Gender from './Gender';
import Age from './Age';
import Bio from './Bio';
import FormButton from './FormButton';
import { ProfileFooter } from './ProfileFooter';
import { ProfilePicture } from './ProfilePicture';
import { NextButton } from './NextButton';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';

type UserProfileData = {
  displayName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
};

export default function UserProfile() {
  useSetNavigationColor('transparent');
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  useEffect(() => {
    if (!userId || !isAuthenticatedUserSession(userSession)) navigate('/login');
  }, [userId, userSession]);

  const canEdit = userId === userSession?.user?.id;
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
          <DisplayName
            onChange={onProfileDataChange}
            isEditMode={isEditMode}
            value={userProfileData?.displayName}
          />
          <div className="mx-auto w-4/5 border-b-2 border-indigo-500 pt-3 opacity-25 lg:mx-0"></div>
          <Email value={userProfileData?.email} isEditMode={isEditMode} />
          <PhoneNumber
            value={userProfileData?.phoneNumber}
            isEditMode={isEditMode}
          />
          <Gender value={userProfileData?.gender} isEditMode={isEditMode} />
          <Age value={userProfileData?.dateOfBirth} isEditMode={isEditMode} />
          <Bio value={userProfileData?.bio} isEditMode={isEditMode} />
          {canEdit && (
            <FormButton
              onEditPress={() => setIsEditMode(!isEditMode)}
              onSavePress={handleSave}
              isEditMode={isEditMode}
            />
          )}
          {canEdit && <ProfileFooter />}
        </div>
        <ProfilePicture
          profilePicUrl={
            'https://images.unsplash.com/photo-1535982368253-05d640fe0755?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
        />
        {canEdit && <NextButton />}
      </div>
    </div>
  );
}
