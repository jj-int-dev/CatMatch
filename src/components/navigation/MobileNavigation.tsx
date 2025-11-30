import { IoMenu, IoClose } from 'react-icons/io5';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { NavigationProps } from './types/NavigationProps';
import { useDiscoveryPreferencesStore } from '../discovery-preferences/stores/discovery-preferences-store';

export function MobileNavigation({
  userType,
  onLogout,
  isLoadingSession,
  userSession,
  isAuthenticatedUserSession
}: NavigationProps) {
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItemStyles =
    'hover:bg-base-100 block py-2 pl-4 text-sm text-gray-300';
  const menuRef = useRef<HTMLUListElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

  const setShowDiscoveryPreferencesDialog = useDiscoveryPreferencesStore(
    (state) => state.setShowDiscoveryPreferencesDialog
  );

  // Handle click outside to close menu and update state
  useEffect(() => {
    // Only set up event listeners when menu is open
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current) {
        const target = event.target as Node;
        if (!menuRef.current.contains(target)) {
          closeMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // Close menu on popover hide event (for browsers that support popover API)
    const popoverElement = document.getElementById('mobile-nav-popover');
    if (popoverElement) {
      popoverElement.addEventListener('hide', closeMenu);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (popoverElement) {
        popoverElement.removeEventListener('hide', closeMenu);
      }
    };
  }, [isMenuOpen]);

  const handlePreferencesClick = () => {
    closeMenu();
    setShowDiscoveryPreferencesDialog(true);
  };

  return (
    <>
      <button
        popoverTarget="mobile-nav-popover"
        style={{ anchorName: '--anchor-mobile' } as React.CSSProperties}
        className="btn btn-square btn-ghost sm:hidden"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="absolute" />
        <span className="sr-only">{t('open_main_menu')}</span>

        <div className="transition-all duration-300">
          {isMenuOpen ? (
            <IoClose className="size-6 rotate-90 transform" />
          ) : (
            <IoMenu className="size-6 rotate-0 transform" />
          )}
        </div>
      </button>
      {isMenuOpen && (
        <ul
          ref={menuRef}
          popover="auto"
          id="mobile-nav-popover"
          style={{ positionAnchor: '--anchor-mobile' } as React.CSSProperties}
          className="dropdown menu-sm dropdown-start rounded-box mt-2 w-25 bg-[#040200] p-2 shadow-md sm:hidden"
        >
          <li>
            <NavLink to="/" className={menuItemStyles} onClick={closeMenu}>
              {t('home')}
            </NavLink>
          </li>
          {isAuthenticatedUserSession(userSession) && (
            <>
              <li>
                <NavLink
                  to={`/user-profile`}
                  className={menuItemStyles}
                  onClick={closeMenu}
                >
                  {t('view_profile')}
                </NavLink>
              </li>
              {!!userType && (
                <li>
                  {userType === 'Rehomer' ? (
                    <NavLink
                      to="/rehomer-dashboard"
                      className={menuItemStyles}
                      onClick={closeMenu}
                    >
                      {t('view_cat_listings')}
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/discovery"
                      className={menuItemStyles}
                      onClick={closeMenu}
                    >
                      {t('adopt_a_cat')}
                    </NavLink>
                  )}
                </li>
              )}
              {!!userType && userType === 'Adopter' && (
                <li>
                  <button
                    className={menuItemStyles}
                    onClick={handlePreferencesClick}
                  >
                    {t('preferences')}
                  </button>
                </li>
              )}
              <li>
                <button onClick={onLogout} className={menuItemStyles}>
                  {t('sign_out')}
                </button>
              </li>
            </>
          )}
          {!isLoadingSession && !isAuthenticatedUserSession(userSession) && (
            <NavLink to="/login" className={menuItemStyles} onClick={closeMenu}>
              {t('sign_in')}
            </NavLink>
          )}
        </ul>
      )}
    </>
  );
}
