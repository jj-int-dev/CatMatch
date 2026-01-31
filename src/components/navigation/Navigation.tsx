import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import useGetUserProfilePictureAndType from '../../hooks/useGetUserProfilePictureAndType';
import defaultProfilePic from '../../assets/default_profile_pic.webp';
import getUniqueImageUrl from '../../utils/getUniqueImageUrl';
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, type NavLinkRenderProps } from 'react-router';
import type { Theme } from '../../types/Theme';
import type { Language } from '../../types/Language';
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
  const userSession = useAuthStore((state) => state.session);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );
  const logUserOut = useAuthStore((state) => state.logUserOut);

  const [theme, setTheme] = useState<Theme>('light');
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsThemeDropdownOpen(false);
  };

  const toggleLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
    setIsLanguageDropdownOpen(false);
  };

  const onLogout = async () => {
    await logUserOut();
    navigate('/login', { replace: true });
  };

  const onMobileLogout = async () => {
    setIsMobileMenuOpen(false);
    await onLogout();
  };

  const { isPending, isError, data } = useGetUserProfilePictureAndType();

  const profilePicUrl =
    isPending || isError || !data.avatarUrl
      ? defaultProfilePic
      : data.avatarUrl!.includes('?timestamp=')
        ? data.avatarUrl!
        : getUniqueImageUrl(data.avatarUrl!);

  const userType = isPending || isError ? null : data.userType;

  const menuItemStyles = ({ isActive }: NavLinkRenderProps): string =>
    `flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
    }`;

  const mobileMenuItemStyles = ({ isActive }: NavLinkRenderProps): string =>
    `flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }`;

  const goToUserProfile = () => navigate(`/user-profile`);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto w-full px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Home Button */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              <FaCat className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden text-xl font-bold sm:inline">
                CatMatch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-2 md:flex lg:space-x-4">
            {/* Main Menu Items */}
            {isAuthenticatedUserSession(userSession) && (
              <>
                {!!userType &&
                  (userType === 'Rehomer' ? (
                    <NavLink to="/rehomer-dashboard" className={menuItemStyles}>
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
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 md:px-4 md:text-sm dark:text-gray-300 dark:hover:bg-gray-800"
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
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => toggleTheme('light')}
                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors ${
                      theme === 'light'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiSun className="h-4 w-4" />
                    <span className="flex-1">{t('light')}</span>
                    {theme === 'light' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleTheme('dark')}
                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors ${
                      theme === 'dark'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiMoon className="h-4 w-4" />
                    <span className="flex-1">{t('dark')}</span>
                    {theme === 'dark' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
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
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 md:px-4 md:text-sm dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FiGlobe className="h-4 w-4" />
                <span>{t('language')}</span>
                <FiChevronDown
                  className={`h-4 w-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                      i18n.language === 'en'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>English</span>
                    {i18n.language === 'en' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleLanguage('es')}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                      i18n.language === 'es'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>Español</span>
                    {i18n.language === 'es' && (
                      <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 md:px-3 md:text-sm dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={goToUserProfile}
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-indigo-200 dark:border-indigo-800">
                  <img
                    src={profilePicUrl}
                    alt={t('profile_picture')}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="hidden lg:inline">{t('profile')}</span>
              </button>
            </div>

            {/* Sign Out Button */}
            <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 md:px-4 md:text-sm dark:text-red-400 dark:hover:bg-red-900/30">
              <FiLogOut className="h-4 w-4" />
              <span>{t('sign_out')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
          className="border-t border-gray-200 bg-white md:hidden dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="space-y-1 px-4 py-3">
            {/* Mobile Profile Section */}
            <div className="mb-4 flex items-center space-x-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-300 dark:border-indigo-700">
                <img
                  src={profilePicUrl}
                  alt={t('profile_picture')}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {t('user_profile')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('view_edit_profile')}
                </p>
              </div>
              <button className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700">
                <FiUser className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            {isAuthenticatedUserSession(userSession) && (
              <>
                {!!userType &&
                  (userType === 'Rehomer' ? (
                    <NavLink
                      to="/rehomer-dashboard"
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
                </NavLink>
              </>
            )}

            {/* Mobile Theme Section */}
            <div className="px-4 py-3">
              <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('theme')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    toggleTheme('light');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-1 items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiSun className="h-4 w-4" />
                  <span>{t('light')}</span>
                  {theme === 'light' && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    toggleTheme('dark');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex flex-1 items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <FiMoon className="h-4 w-4" />
                  <span>{t('dark')}</span>
                  {theme === 'dark' && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Language Section */}
            <div className="px-4 py-3">
              <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('language')}
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    toggleLanguage('en');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    i18n.language === 'en'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>English</span>
                  {i18n.language === 'en' && (
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>

                <button
                  onClick={() => {
                    toggleLanguage('es');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    i18n.language === 'es'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>Español</span>
                  {i18n.language === 'es' && (
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Sign Out Button */}
            <button
              onClick={onMobileLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <FiLogOut className="h-5 w-5" />
              <span>{t('sign_out')}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
