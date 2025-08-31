import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

type ConfirmUserTypeButtonProps = { onPress: () => void };

export function ConfirmUserTypeButton({ onPress }: ConfirmUserTypeButtonProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full justify-center">
      <button
        onClick={onPress}
        className="btn btn-xl hover:inset-shadow-xl gap-x-2 rounded-full border-white bg-white p-6 text-[#3e98fd] shadow-md ring-4 shadow-white ring-white transition-transform duration-300 ease-in-out hover:translate-y-2 hover:text-green-500 hover:shadow-sm hover:inset-shadow-white"
      >
        <span>{t('next')}</span>
        <FaArrowRight />
      </button>
    </div>
  );
}
