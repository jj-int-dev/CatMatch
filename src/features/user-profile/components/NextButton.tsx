import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';

export function NextButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="ml-45 flex">
      <button
        onClick={() => navigate('/user-type-selection')}
        className="btn btn-xl hover:inset-shadow-xl gap-x-2 rounded-full border-white bg-white p-6 text-indigo-500 shadow-md ring-4 shadow-white ring-white transition-transform duration-300 ease-in-out hover:translate-y-2 hover:text-[#ff13f0] hover:shadow-sm hover:inset-shadow-white"
      >
        <span>{t('next')}</span>
        <FaArrowRight />
      </button>
    </div>
  );
}
