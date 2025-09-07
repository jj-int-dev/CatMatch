import { FaBell } from 'react-icons/fa';
import catLogo from '../../assets/cat_logo.png';
import { NavLink } from 'react-router';
import { MobileNavigation } from './MobileNavigation';
import { navLinkItems, type NavLinkItem } from './data/navLinkItems';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { LanguageNavigation } from './LanguageNavigation';
import { useNavigationStore } from '../../stores/navigation-store';
import { useAuthStore } from '../../stores/auth-store';
import ProfilePicture from './ProfilePicture';

export default function Navigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigationColor = useNavigationStore((state) => state.color);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUser = useAuthStore(
    (state) => state.isAuthenticatedUser
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);

  const onLogout = async () => {
    await logUserOut();
    navigate('/login', { replace: true });
  };

  const canShowItem = (item: NavLinkItem): boolean => {
    return (
      (!item.authRequired ||
        (item.authRequired && isAuthenticatedUser(userSession))) &&
      (!item.unAuthRequired ||
        (item.unAuthRequired && !isAuthenticatedUser(userSession)))
    );
  };

  return (
    <div
      className={`navbar sticky top-0 z-50 grid grid-cols-12 bg-${navigationColor}`}
    >
      <MobileNavigation />
      <div className="col-span-6 flex flex-row items-center pl-2 sm:justify-start md:pl-6">
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
            {isAuthenticatedUser(userSession) && (
              <ProfilePicture userId={userSession!.user!.id} />
            )}
            {navLinkItems
              .filter((item) => canShowItem(item))
              .map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? 'rounded-xl bg-indigo-900 px-4 py-3 text-sm font-bold text-white'
                      : 'rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-white hover:bg-indigo-900 hover:font-bold'
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            {isAuthenticatedUser(userSession) && (
              <button
                className="btn btn-ghost rounded-xl text-sm font-medium text-white hover:fill-indigo-900 hover:font-bold"
                onClick={onLogout}
              >
                {t('logout')}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-flow-reverse col-span-6 flex items-center justify-end gap-x-4 pr-2 md:pr-6">
        {isAuthenticatedUser(userSession) && (
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
