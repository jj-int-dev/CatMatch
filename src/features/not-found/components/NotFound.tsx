import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <main className="grid min-h-full place-items-center bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-400">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            {t('page_not_found_title')}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            {t('page_not_found_description')}
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Link
              to="/"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t('go_back_home')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
