import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import useGetUserProfilePicture from '../../hooks/useGetUserProfilePicture';
import useGetUserType from '../../hooks/useGetUserType';
import useRealtimeUnreadCount from './hooks/useRealtimeUnreadCount';
import { useTheme } from '../../hooks/useTheme';
import defaultProfilePic from '../../assets/default_profile_pic.webp';
import getUniqueImageUrl from '../../utils/getUniqueImageUrl';
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, type NavLinkRenderProps } from 'react-router';
import type { Language } from '../../types/Language';
import type { Theme } from '../../types/Theme';
import {
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiSun,
  FiMoon,
  FiGlobe,
  FiChevronDown,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { FaCat } from 'react-icons/fa';

export default function Navigation() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);
  const { theme, setTheme } = useTheme();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleThemeToggle = (newTheme: Theme, closeMobileMenu = false) => {
    setTheme(newTheme);
    setIsThemeDropdownOpen(false);
    if (closeMobileMenu) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLanguageToggle = (
    newLanguage: Language,
    closeMobileMenu = false
  ) => {
    i18n.changeLanguage(newLanguage);
    setIsLanguageDropdownOpen(false);
    if (closeMobileMenu) {
      setIsMobileMenuOpen(false);
    }
  };

  const onLogout = async () => {
    await logUserOut();
    navigate('/login', { replace: true });
  };

  const onMobileLogout = async () => {
    setIsMobileMenuOpen(false);
    await onLogout();
  };

  const {
    isPending: isGettingProfilePicture,
    isError: getProfilePictureFailed,
    data: profilePicture
  } = useGetUserProfilePicture();
  const { isPending: isGettingUserType, data: userType } = useGetUserType();
  const { data: unreadCount } = useRealtimeUnreadCount();

  const profilePicUrl =
    isGettingProfilePicture || getProfilePictureFailed || !profilePicture
      ? defaultProfilePic
      : profilePicture.includes('?timestamp=')
        ? profilePicture
        : getUniqueImageUrl(profilePicture);

  const menuItemStyles = ({ isActive }: NavLinkRenderProps): string =>
    `flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-content'
        : 'text-base-content hover:bg-base-200'
    }`;

  const mobileMenuItemStyles = ({ isActive }: NavLinkRenderProps): string =>
    `flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-content'
        : 'text-base-content hover:bg-base-200'
    }`;

  const goToUserProfile = () => navigate(`/user-profile`);

  return (
    <nav className="border-base-300 bg-base-100 sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="mx-auto w-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Home Button */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-base-content hover:text-primary flex items-center space-x-2 transition-colors"
            >
              <FaCat className="text-primary h-8 w-8" />
              <span className="hidden text-xl font-bold sm:inline">
                CatMatch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-2 md:flex lg:space-x-4">
            {/* Main Menu Items */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <>
                {!isGettingUserType &&
                  !!userType &&
                  (userType === 'Rehomer' ? (
                    <NavLink to="/rehomer/dashboard" className={menuItemStyles}>
                      <FaCat className="h-4 w-4" />
                      <span>{t('my_cats')}</span>
                    </NavLink>
                  ) : (
                    <NavLink to="/discovery" className={menuItemStyles}>
                      <FaCat className="h-4 w-4" />
                      <span>{t('adopt')}</span>
                    </NavLink>
                  ))}

                <NavLink to="/messages" className={menuItemStyles}>
                  <FiMessageSquare className="h-4 w-4" />
                  <span>{t('messages')}</span>
                  {!!unreadCount && unreadCount > 0 && (
                    <span className="bg-error text-error-content ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            {/* Theme Dropdown */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  setIsLanguageDropdownOpen(false);
                }}
                className="text-base-content hover:bg-base-200 flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm"
              >
                {theme === 'light' ? (
                  <FiSun className="h-4 w-4" />
                ) : (
                  <FiMoon className="h-4 w-4" />
                )}
                <span>{t('theme')}</span>
                <FiChevronDown
                  className={`h-4 w-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isThemeDropdownOpen && (
                <div className="border-base-300 bg-base-100 absolute right-0 z-10 mt-2 w-48 rounded-lg border py-1 shadow-lg">
                  <button
                    onClick={() => handleThemeToggle('light')}
                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content hover:bg-base-200'
                    }`}
                  >
                    <FiSun className="h-4 w-4" />
                    <span className="flex-1">{t('light')}</span>
                    {theme === 'light' && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </button>
                  <button
                    onClick={() => handleThemeToggle('dark')}
                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content hover:bg-base-200'
                    }`}
                  >
                    <FiMoon className="h-4 w-4" />
                    <span className="flex-1">{t('dark')}</span>
                    {theme === 'dark' && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  setIsThemeDropdownOpen(false);
                }}
                className="text-base-content hover:bg-base-200 flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm"
              >
                <FiGlobe className="h-4 w-4" />
                <span>{t('language')}</span>
                <FiChevronDown
                  className={`h-4 w-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageDropdownOpen && (
                <div className="border-base-300 bg-base-100 absolute right-0 z-10 mt-2 w-48 rounded-lg border py-1 shadow-lg">
                  <button
                    onClick={() => handleLanguageToggle('en')}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                      i18n.language === 'en'
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content hover:bg-base-200'
                    }`}
                  >
                    <span>English</span>
                    {i18n.language === 'en' && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => handleLanguageToggle('es')}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                      i18n.language === 'es'
                        ? 'bg-primary/10 text-primary'
                        : 'text-base-content hover:bg-base-200'
                    }`}
                  >
                    <span>Español</span>
                    {i18n.language === 'es' && (
                      <div className="bg-primary h-2 w-2 rounded-full" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <div className="relative">
                <button
                  className="text-base-content hover:bg-base-200 flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-3 md:text-sm"
                  onClick={goToUserProfile}
                >
                  <div className="border-primary/30 relative h-8 w-8 overflow-hidden rounded-full border-2">
                    <img
                      src={profilePicUrl}
                      alt={t('profile_picture')}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="hidden lg:inline">{t('profile')}</span>
                </button>
              </div>
            )}

            {/* Sign Out Button */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <button
                onClick={onLogout}
                className="text-error hover:bg-error/10 flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm"
              >
                <FiLogOut className="h-4 w-4" />
                <span>{t('sign_out')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-base-content hover:bg-base-200 rounded-lg p-2 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="border-base-300 bg-base-100 border-t md:hidden"
        >
          <div className="space-y-1 px-4 py-3">
            {/* Mobile Profile Section */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <div className="bg-base-200 mb-4 flex items-center space-x-3 rounded-lg p-4">
                <div className="border-primary/40 relative h-12 w-12 overflow-hidden rounded-full border-2">
                  <img
                    src={profilePicUrl}
                    alt={t('profile_picture')}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-base-content font-medium">
                    {t('user_profile')}
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    {t('view_edit_profile')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToUserProfile();
                  }}
                  className="text-base-content hover:bg-base-300 rounded-lg p-2 transition-colors"
                >
                  <FiUser className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Mobile Menu Items */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <>
                {!isGettingUserType &&
                  !!userType &&
                  (userType === 'Rehomer' ? (
                    <NavLink
                      to="/rehomer/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={mobileMenuItemStyles}
                    >
                      <FaCat className="h-4 w-4" />
                      <span>{t('my_cats')}</span>
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/discovery"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={mobileMenuItemStyles}
                    >
                      <FaCat className="h-4 w-4" />
                      <span>{t('adopt')}</span>
                    </NavLink>
                  ))}

                <NavLink
                  to="/messages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileMenuItemStyles}
                >
                  <FiMessageSquare className="h-4 w-4" />
                  <span>{t('messages')}</span>
                  {!!unreadCount && unreadCount > 0 && (
                    <span className="bg-error text-error-content ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            {/* Mobile Theme Section */}
            <div className="px-4 py-3">
              <div className="text-base-content/70 mb-2 text-sm font-medium">
                {t('theme')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleThemeToggle('light', true)}
                  className={`flex flex-1 items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content hover:bg-base-200'
                  }`}
                >
                  <FiSun className="h-4 w-4" />
                  <span>{t('light')}</span>
                  {theme === 'light' && (
                    <div className="bg-primary ml-auto h-2 w-2 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => handleThemeToggle('dark', true)}
                  className={`flex flex-1 items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content hover:bg-base-200'
                  }`}
                >
                  <FiMoon className="h-4 w-4" />
                  <span>{t('dark')}</span>
                  {theme === 'dark' && (
                    <div className="bg-primary ml-auto h-2 w-2 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Language Section */}
            <div className="px-4 py-3">
              <div className="text-base-content/70 mb-2 text-sm font-medium">
                {t('language')}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleLanguageToggle('en', true)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content hover:bg-base-200'
                  }`}
                >
                  <span>English</span>
                  {i18n.language === 'en' && (
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => handleLanguageToggle('es', true)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    i18n.language === 'es'
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content hover:bg-base-200'
                  }`}
                >
                  <span>Español</span>
                  {i18n.language === 'es' && (
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Sign Out Button */}
            {!isLoadingSession && isAuthenticatedUserSession(userSession) && (
              <button
                onClick={onMobileLogout}
                className="text-error hover:bg-error/10 flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors"
              >
                <FiLogOut className="h-5 w-5" />
                <span>{t('sign_out')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
