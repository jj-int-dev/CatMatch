import { UserAvatar } from './UserAvatar';
import { useTranslation } from 'react-i18next';

export function GreetingRow() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <UserAvatar />
      <div className="mt-8">
        <h1 className="text-5xl font-bold text-white">{t('welcome')}</h1>
      </div>
      <div className="mt-8">
        <h1 className="text-3xl text-[rgba(253,254,251)] opacity-70">
          {t('are_you_looking_to')}
        </h1>
      </div>
    </div>
  );
}
