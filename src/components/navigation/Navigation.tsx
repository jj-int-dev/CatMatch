import { FaBell } from 'react-icons/fa';
import { MobileNavigation } from './MobileNavigation';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { LanguageNavigation } from './LanguageNavigation';
import { useNavigationStore } from '../../stores/navigation-store';
import { useAuthStore } from '../../stores/auth-store';
import useGetUserProfilePictureAndType from '../../hooks/useGetUserProfilePictureAndType';
import defaultProfilePic from '../../assets/default_profile_pic.jpg';
import DesktopNavigation from './DesktopNavigation';

export default function Navigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigationColor = useNavigationStore((state) => state.color);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);

  const onLogout = async () => {
    await logUserOut();
    navigate('/login', { replace: true });
  };

  const { isPending, isError, data } = useGetUserProfilePictureAndType();
  const profilePicUrl =
    isPending || isError || !data.avatarUrl
      ? defaultProfilePic
      : data.avatarUrl!;
  const userType = isPending || isError ? null : data.userType;

  return (
    <div
      className={`navbar sticky top-0 z-50 grid grid-cols-12 bg-${navigationColor}`}
    >
      <MobileNavigation
        isLoadingSession={isLoadingSession}
        userSession={userSession}
        isAuthenticatedUserSession={isAuthenticatedUserSession}
        userType={userType}
        onLogout={onLogout}
      />
      <DesktopNavigation
        isLoadingSession={isLoadingSession}
        userSession={userSession}
        isAuthenticatedUserSession={isAuthenticatedUserSession}
        userType={userType}
        profilePicUrl={profilePicUrl}
        onLogout={onLogout}
      />
      <div className="flex-flow-reverse col-span-6 flex items-center justify-end gap-x-4 pr-2 max-sm:col-start-7 md:pr-6">
        {isAuthenticatedUserSession(userSession) && (
          <span className="cursor-pointer text-white hover:text-yellow-500">
            <span className="sr-only">{t('view_notifications')}</span>
            <FaBell aria-hidden="true" className="size-6" />
          </span>
        )}
        <DarkModeToggle />
        <LanguageNavigation />
      </div>
    </div>
  );
}
