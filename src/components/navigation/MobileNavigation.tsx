import { IoMenu, IoClose } from 'react-icons/io5';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { NavigationProps } from './types/NavigationProps';

export function MobileNavigation({
  userType,
  onLogout,
  userSession,
  isAuthenticatedUserSession
}: NavigationProps) {
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItemStyles =
    'hover:bg-base-100 block py-2 pl-4 text-sm text-gray-300';

  return (
    <>
      <button
        popoverTarget="mobile-nav-popover"
        style={{ anchorName: '--anchor-1' } as React.CSSProperties}
        className="btn btn-square btn-ghost sm:hidden"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="absolute -inset-0.5" />
        <span className="sr-only">{t('open_main_menu')}</span>
        {!isMenuOpen && <IoMenu className="size-6" />}
        {isMenuOpen && <IoClose className="size-6" />}
      </button>
      {isMenuOpen && (
        <ul
          popover="auto"
          id="mobile-nav-popover"
          style={{ positionAnchor: '--anchor-1' } as React.CSSProperties}
          className="dropdown menu-sm dropdown-end rounded-box mt-2 w-25 bg-[#040200] p-2 shadow-md sm:hidden"
        >
          <li>
            <NavLink to="/" className={menuItemStyles}>
              {t('home')}
            </NavLink>
          </li>
          {isAuthenticatedUserSession(userSession) && (
            <>
              <li>
                <NavLink
                  to={`/user-profile/${userSession!.user!.id}`}
                  className={menuItemStyles}
                >
                  {t('view_profile')}
                </NavLink>
              </li>
              {!!userType && (
                <li>
                  {userType === 'Rehomer' ? (
                    <NavLink to="/rehomer-dashboard" className={menuItemStyles}>
                      {t('view_cat_listings')}
                    </NavLink>
                  ) : (
                    <NavLink to="/discovery" className={menuItemStyles}>
                      {t('adopt_a_cat')}
                    </NavLink>
                  )}
                </li>
              )}
              <li>
                <button onClick={onLogout} className={menuItemStyles}>
                  {t('logout')}
                </button>
              </li>
            </>
          )}
          {!isAuthenticatedUserSession(userSession) && (
            <NavLink to="/login" className={menuItemStyles}>
              {t('sign_in')}
            </NavLink>
          )}
        </ul>
      )}
    </>
  );
}
