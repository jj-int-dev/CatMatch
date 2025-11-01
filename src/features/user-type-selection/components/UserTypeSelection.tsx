import { useEffect } from 'react';
import { useSetNavigationColor } from '../../../hooks/useSetNavigationColor';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import { UserTypeCard } from './UserTypeCard';
import { FaArrowRight } from 'react-icons/fa';
import { ConfirmChangeUserTypeDialog } from '../../../components/confirm-change-user-type/ConfirmChangeUserType';
import { useChangeUserTypeStore } from '../../../components/confirm-change-user-type/stores/change-user-type-store';
import {
  getAdopterExplanations,
  getRehomerExplanations
} from '../utils/getUserTypeExplanations';
import useGetUserProfilePictureAndType from '../../../hooks/useGetUserProfilePictureAndType';
import defaultProfilePic from '../../../assets/default_profile_pic.jpg';
import useUpdateUserType from '../hooks/useUpdateUserType';
import { useQueryClient } from '@tanstack/react-query';
import type { GetUserProfilePictureAndTypeResponse } from '../../../types/GetUserProfilePictureAndTypeResponse';
import InternalServerError from '../../../components/internal-server-error/InternalServerError';
import UserTypeSelectionSkeleton from './UserTypeSelectionSkeleton';

export default function UserTypeSelection() {
  useSetNavigationColor('transparent');
  const params = useParams();
  const userId = params['userId'];
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToNextPageBasedOnUserType = () => {
    if (newUserType === 'Adopter') {
      navigate('/discovery-preferences');
    } else if (newUserType === 'Rehomer') {
      navigate('/rehomer-dashboard');
    }
  };

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

  const {
    isPending: isLoadingUserPicAndType,
    isError: getUserPicAndTypeFailed,
    data: userPicAndType
  } = useGetUserProfilePictureAndType();

  const {
    isPending: isUpdatingUserType,
    isError: updateUserTypeFailed,
    mutateAsync: updateUserType
  } = useUpdateUserType();

  const newUserType = useChangeUserTypeStore((state) => state.newUserType);
  const setShowChangeUserTypeDialog = useChangeUserTypeStore(
    (state) => state.setShowChangeUserTypeDialog
  );

  const onChooseUserType = async () => {
    if (userPicAndType?.userType) {
      if (userPicAndType.userType !== newUserType) {
        setShowChangeUserTypeDialog(true);
      } else {
        goToNextPageBasedOnUserType();
      }
    } else {
      await updateUserType(newUserType!);
      queryClient.setQueryData(
        ['navigation', userId],
        (oldData: GetUserProfilePictureAndTypeResponse) => {
          return { ...oldData, userType: newUserType };
        }
      );
      goToNextPageBasedOnUserType();
    }
  };

  if (isLoadingUserPicAndType) {
    return <UserTypeSelectionSkeleton />;
  }

  if (getUserPicAndTypeFailed || updateUserTypeFailed) {
    return <InternalServerError />;
  }

  return (
    <div className="-mt-16 flex h-screen w-screen flex-col items-center justify-center bg-[#3e98fd] bg-cover bg-center">
      <div className="mb-25 grid grid-cols-12">
        <div className="col-span-4 pt-8">
          <div className="flex flex-col">
            <div className="avatar pl-4">
              <div className="w-48 rounded-full">
                <img
                  src={
                    isLoadingUserPicAndType || !userPicAndType.avatarUrl
                      ? defaultProfilePic
                      : userPicAndType.avatarUrl
                  }
                />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-5xl font-bold text-white">{t('welcome')}</h1>
            </div>
            <div className="mt-8">
              <h1 className="text-3xl text-[rgba(253,254,251)] opacity-70">
                {t('are_you_looking_to')}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-span-8 flex items-center">
          <div className="flex flex-row gap-x-10">
            <UserTypeCard
              cardTitle={`${t('adopt_a_cat')} 🐈`}
              cardPhrases={getAdopterExplanations()}
              initialUserType={userPicAndType!.userType!}
              userTypeForCard="Adopter"
            />
            <UserTypeCard
              cardTitle={`${t('rehome_a_cat')} 🏠`}
              cardPhrases={getRehomerExplanations()}
              initialUserType={userPicAndType!.userType!}
              userTypeForCard="Rehomer"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={onChooseUserType}
          disabled={!newUserType || isUpdatingUserType}
          className="btn btn-xl hover:inset-shadow-xl gap-x-2 rounded-full border-white bg-white p-6 text-[#3e98fd] shadow-md ring-4 shadow-white ring-white transition-transform duration-300 ease-in-out hover:translate-y-2 hover:text-green-500 hover:shadow-sm hover:inset-shadow-white"
        >
          <span>{t('next')}</span>
          <FaArrowRight />
        </button>
      </div>

      {/* Confirm Change User Type Dialog */}
      <ConfirmChangeUserTypeDialog />
    </div>
  );
}
