import { useState, useEffect, useRef } from 'react';
import { getLanguageIcon, setLanguage } from './utils/languageUtils';
import { useTranslation } from 'react-i18next';

export function LanguageNavigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  const closeMenu = () => setIsMenuOpen(false);

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

    // Listen for popover hide events
    const popoverElement = document.getElementById('language-popover');
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

  const setLanguageAndCloseMenu = (language: string) => {
    setLanguage(language);
    closeMenu();
  };

  return (
    <>
      <button
        popoverTarget="language-popover"
        style={{ anchorName: '--anchor-lng' } as React.CSSProperties}
        className="relative flex cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="absolute" />
        <span className="sr-only">{t('change_language')}</span>
        <img
          alt="current language icon"
          src={getLanguageIcon()}
          className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
        />
      </button>
      {isMenuOpen && (
        <ul
          ref={menuRef}
          popover="auto"
          id="language-popover"
          style={{ positionAnchor: '--anchor-lng' } as React.CSSProperties}
          className="dropdown menu-sm dropdown-end rounded-box mt-2 w-25 bg-[#040200] p-2 shadow-md"
        >
          <li>
            <a
              href="#"
              className="hover:bg-base-100 block py-2 pl-4 text-sm text-gray-300"
              onClick={() => setLanguageAndCloseMenu('en')}
            >
              English
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:bg-base-100 block py-2 pl-4 text-sm text-gray-300"
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
