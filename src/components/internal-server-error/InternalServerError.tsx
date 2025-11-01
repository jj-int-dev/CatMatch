import { useTranslation } from 'react-i18next';

export default function InternalServerError() {
  const { t } = useTranslation();

  return (
    // outer fixed full-viewport flex centers the inner panel both horizontally and vertically
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="max-h-[90vh] max-w-[min(90vw,900px)] overflow-auto p-16">
        <img
          className="h-[225px] w-[256px]"
          src="https://i.imgur.com/qIufhof.png"
        />
        <h1 className="mt-4 text-center text-6xl">500</h1>
        <h2 className="mt-4 text-4xl">{t('internal_server_error')}</h2>
        <p className="mt-4">{t('internal_server_error_desc')}</p>
      </div>
    </div>
  );
}
