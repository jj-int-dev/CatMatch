import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="from-base-200 to-base-300 flex min-h-screen items-center justify-center bg-gradient-to-br px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* 404 Badge */}
        <div className="mb-8 flex justify-center">
          <div className="badge badge-primary badge-lg px-6 py-4 text-4xl font-bold shadow-lg">
            404
          </div>
        </div>

        {/* Title */}
        <h1 className="text-base-content mb-6 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
          {t('page_not_found_title')}
        </h1>

        {/* Description */}
        <p className="text-base-content/70 mx-auto mb-10 max-w-2xl text-lg text-pretty sm:text-xl">
          {t('page_not_found_description')}
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary btn-lg gap-2 shadow-lg">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t('go_back_home')}
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex justify-center gap-2">
          <div
            className="bg-primary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="bg-secondary h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="bg-accent h-2 w-2 animate-bounce rounded-full"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
