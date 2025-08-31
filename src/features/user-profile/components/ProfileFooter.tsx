import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function ProfileFooter() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-4/5 flex-wrap items-center justify-between pb-16 lg:w-full lg:pb-0">
      <Link className="link" to="#">
        <span className="h-6 fill-current text-gray-600 hover:font-bold hover:text-indigo-700">
          {t('change_password')}
        </span>
      </Link>
      <Link className="link" to="#">
        <span className="h-6 fill-current text-gray-600 hover:font-bold hover:text-indigo-700">
          {t('become_an_adopter')}
        </span>
      </Link>
      <Link className="link" to="#">
        <span className="h-6 fill-current text-red-600 hover:font-bold">
          {t('delete_account')}
        </span>
      </Link>
    </div>
  );
}
