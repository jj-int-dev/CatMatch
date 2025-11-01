import catLogo from '../../assets/cat_logo.png';
import ProfilePicture from './ProfilePicture';
import { NavLink, type NavLinkRenderProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { NavigationProps } from './types/NavigationProps';
import { RiLogoutBoxRLine } from 'react-icons/ri';

type DesktopNavigationProps = NavigationProps & { profilePicUrl: string };

export default function DesktopNavigation({
  userType,
  onLogout,
  isLoadingSession,
  userSession,
  isAuthenticatedUserSession,
  profilePicUrl
}: DesktopNavigationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItemStyles = ({ isActive }: NavLinkRenderProps): string =>
    isActive
      ? 'rounded-xl bg-indigo-900 px-4 py-3 text-sm font-bold text-white'
      : 'rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-white hover:bg-indigo-900 hover:font-bold';

  return (
    <div className="col-span-6 flex flex-row items-center pl-2 max-sm:hidden sm:justify-start md:pl-6">
      <div className="flex shrink-0 items-center">
        <img
          alt="CatMatch Logo"
          src={catLogo}
          className="h-[45px] w-auto transition-all duration-300 ease-in-out hover:scale-110 hover:cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="hidden sm:ml-3 sm:block">
        <div className="flex space-x-3">
          {isAuthenticatedUserSession(userSession) && (
            <>
              <ProfilePicture
                imgSrc={profilePicUrl}
                userId={userSession!.user.id}
              />
              {!!userType &&
                (userType === 'Rehomer' ? (
                  <NavLink to="/rehomer-dashboard" className={menuItemStyles}>
                    {t('view_cat_listings')}
                  </NavLink>
                ) : (
                  <NavLink to="/discovery" className={menuItemStyles}>
                    {t('adopt_a_cat')}
                  </NavLink>
                ))}
              <button
                className="btn btn-outline btn-circle text-white transition duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                onClick={onLogout}
              >
                <RiLogoutBoxRLine className="size-6" />
              </button>
            </>
          )}
          {!isLoadingSession && !isAuthenticatedUserSession(userSession) && (
            <NavLink to="/login" className={menuItemStyles}>
              {t('sign_in')}
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
