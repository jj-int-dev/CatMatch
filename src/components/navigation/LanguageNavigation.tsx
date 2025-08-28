import { useState } from 'react';
import { getLanguageIcon, setLanguage } from './utils/languageUtils';
import { useTranslation } from 'react-i18next';

export function LanguageNavigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const setLanguageAndCloseMenu = (language: string) => {
    setLanguage(language);
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <button
        className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">{t('change_language')}</span>
        <img
          alt="current language icon"
          src={getLanguageIcon()}
          className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
        />
      </button>
      {isMenuOpen && (
        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
              onClick={() => setLanguageAndCloseMenu('en')}
            >
              English
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
              onClick={() => setLanguageAndCloseMenu('es')}
            >
              Español
            </a>
          </li>
        </ul>
      )}
    </>
  );
}
