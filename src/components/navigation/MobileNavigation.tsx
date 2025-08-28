import { IoMenu, IoClose } from 'react-icons/io5';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { navLinkItems } from './data/navLinkItems';
import { useState } from 'react';

export function MobileNavigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="absolute -inset-0.5" />
          <span className="sr-only">{t('open_main_menu')}</span>
          {!isMenuOpen && (
            <IoMenu aria-hidden="true" className="block size-6" />
          )}
          {isMenuOpen && (
            <IoClose aria-hidden="true" className="hidden size-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          {navLinkItems.map((item) => (
            <li>
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-lg bg-gray-950/50 p-4 text-sm font-semibold text-white'
                    : 'rounded-lg bg-transparent p-4 text-sm font-medium text-gray-300 hover:bg-gray-950/50 hover:font-semibold hover:text-white'
                }
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
