import { AiOutlineMail } from 'react-icons/ai';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function ForgotPassword() {
  const { t } = useTranslation();

  return (
    <div className="bg-main-background mobile:p-0 tablet-lg:py-24 z-0 mt-[-40px] flex min-h-screen flex-col items-center justify-center bg-cover">
      <div className="mobile:h-screen mobile:max-h-screen mobile:border-0 mobile:px-4 mobile:shadow-none mobile:w-screen mobile:pt-38 flex max-h-140 w-132 flex-col rounded-xl bg-white px-18 pt-8 pb-6 shadow-lg">
        <div className="flex h-full flex-col items-center justify-between">
          <div className="w-full">
            <div className="mb-8 flex justify-center">
              <div className="mobile:text-2xl mobile:leading-8 text-center text-3xl leading-10 font-bold text-black">
                {t('forgot_your_password')}
              </div>
            </div>
            <div className="mb-5 text-base leading-5.5 text-gray-700">
              {t('enter_your_email_to_reset')}
            </div>
            <div className="relative">
              <AiOutlineMail className="pointer-events-none absolute top-1.5 size-7 pl-3 align-middle text-gray-900" />
              <input
                data-auth-input-has-error="false"
                type="text"
                className="hover:border-primary focus:border-primary focus:ring-primary/25 mt-2 block h-10 w-full rounded-lg border border-gray-300 pl-9 text-gray-900 placeholder:text-gray-600 focus:ring-4 focus:outline-none"
                placeholder="Email"
                value=""
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button className="active:bg-primary-600 hover:bg-primary-600 flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-indigo-500 px-6 text-white transition-colors duration-200 focus:outline-none">
                {t('reset_password')}
              </button>
            </div>
          </div>
          <Link
            className="relative mt-8 cursor-pointer pl-5 leading-5.5 font-bold text-indigo-500"
            to="/login"
          >
            <IoIosArrowRoundBack className="absolute top-1/2 left-0 mr-3 h-6 w-6 -translate-y-1/2 text-indigo-500" />
            <span className="pl-1">{t('back_to_login')}</span>
            <div className="absolute inset-x-0 top-full -mt-1 h-px bg-indigo-500"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
