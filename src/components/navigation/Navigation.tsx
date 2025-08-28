import { FaBell } from 'react-icons/fa';
import catLogo from '../../assets/cat_logo.png';
import { NavLink } from 'react-router';
import { MobileNavigation } from './MobileNavigation';
import { navLinkItems } from './data/navLinkItems';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { LanguageNavigation } from './LanguageNavigation';

export default function Navigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="navbar z-1 grid grid-cols-12 bg-[#7289DA]">
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
            {navLinkItems.map((item) => (
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
          </div>
        </div>
      </div>
      <div className="flex-flow-reverse col-span-6 flex items-center justify-end gap-x-4 pr-2 md:pr-6">
        <span className="text-white hover:cursor-pointer hover:text-yellow-500">
          <span className="sr-only">{t('view_notifications')}</span>
          <FaBell aria-hidden="true" className="size-6" />
        </span>
        <DarkModeToggle />
        <LanguageNavigation />
      </div>
    </div>
  );
}
