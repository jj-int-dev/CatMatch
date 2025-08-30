import { useState, useEffect } from 'react';
import { useNavigationStore } from '../../../stores/navigation-store';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function UserTypeSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const setNavigationColor = useNavigationStore(
    (state) => state.setNavigationColor
  );
  const resetNavigationColor = useNavigationStore(
    (state) => state.resetNavigationColor
  );

  useEffect(() => {
    setNavigationColor('transparent');
    return () => resetNavigationColor();
  }, []);

  const [isAdopter, setIsAdopter] = useState<boolean | null>(null);

  const goToNextPage = () => {
    if (isAdopter === true) {
      navigate('/adopter-explanation');
    } else if (isAdopter === false) {
      navigate('/add-cat-listing');
    }
  };

  return (
    <div className="-mt-16 flex h-screen w-screen flex-col items-center justify-center bg-[#3e98fd] bg-cover bg-center">
      <div className="mb-25 grid grid-cols-12">
        <div className="col-span-4 pt-8">
          <div className="flex flex-col">
            <div className="avatar pl-4">
              <div className="w-48 rounded-full">
                <img src="https://images.unsplash.com/photo-1535982368253-05d640fe0755?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              </div>
            </div>
            <div className="mt-8">
              <h1 className="text-5xl font-bold text-white">{t('welcome')}!</h1>
            </div>
            <div className="mt-8">
              <h1 className="text-3xl text-[rgba(253,254,251)] opacity-70">
                {t('are_you_looking_to')}
              </h1>
            </div>
          </div>
        </div>
        <div className="col-span-8 flex items-center">
          <div className="flex flex-row gap-x-10">
            <div className="card w-96 rounded-4xl bg-white text-black shadow-sm">
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{t('adopt_a_cat')} 🐈</h2>
                  <input
                    type="radio"
                    name="radio-1"
                    checked={isAdopter === true}
                    onChange={() => setIsAdopter(true)}
                    className="radio radio-xl border-blue-300 bg-white checked:border-blue-600 checked:bg-blue-200 checked:text-blue-600"
                  />
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>High-resolution image generation</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Customizable style templates</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Batch processing capabilities</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>AI-driven image enhancements</span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-base-content/50 me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Seamless cloud integration
                    </span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-base-content/50 me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Real-time collaboration tools
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card w-96 rounded-4xl bg-white text-black shadow-sm">
              <div className="card-body">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">{t('rehome_a_cat')} 🏠</h2>
                  <input
                    type="radio"
                    name="radio-2"
                    checked={isAdopter === false}
                    onChange={() => setIsAdopter(false)}
                    className="radio radio-xl border-blue-300 bg-white checked:border-blue-600 checked:bg-blue-200 checked:text-blue-600"
                  />
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>High-resolution image generation</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Customizable style templates</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Batch processing capabilities</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-success me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>AI-driven image enhancements</span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-base-content/50 me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Seamless cloud integration
                    </span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-base-content/50 me-2 inline-block size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Real-time collaboration tools
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={() => goToNextPage()}
          className="btn btn-xl hover:inset-shadow-xl gap-x-2 rounded-full border-white bg-white p-6 text-[#3e98fd] shadow-md ring-4 shadow-white ring-white transition-transform duration-300 ease-in-out hover:translate-y-2 hover:text-green-500 hover:shadow-sm hover:inset-shadow-white"
        >
          <span>{t('next')}</span>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
