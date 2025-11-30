import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ErrorToast from '../../../components/toasts/ErrorToast';

type UserProfileSkeletonProps = {
  errorMessages?: string[];
};

export default function ({ errorMessages }: UserProfileSkeletonProps) {
  const { t } = useTranslation();
  const [showErrorToast, setShowErrorToast] = useState(
    !!errorMessages && errorMessages.length > 0
  );

  return (
    <div className="-mt-16 flex h-screen w-screen justify-center bg-[#f9f9f9] bg-cover bg-center px-4 pt-28">
      {showErrorToast && (
        <ErrorToast
          messages={errorMessages!}
          onCloseToast={() => setShowErrorToast(false)}
        />
      )}
      <div className="mx-6 h-[43.423rem] w-[30.999rem] rounded-2xl bg-gradient-to-r from-[#b8d2f1] to-[#fdf7e1] pt-16 shadow-md sm:mx-0">
        <div className="h-full w-full bg-[#f9f9f9] px-6 py-8">
          <div className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 flex flex-row gap-x-4 sm:col-span-6">
              <div className="skeleton h-[3rem] w-[3rem] rounded-full" />
              <div className="pt-3">
                <div className="skeleton h-[1.499rem] w-[5.701rem]" />
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 sm:justify-self-end">
              <div className="flex flex-row gap-x-4">
                <div className="skeleton h-[2.5rem] w-[3.638rem]" />
                <div className="skeleton h-[2.5rem] w-[3.638rem]" />
              </div>
            </div>
          </div>
          <fieldset className="fieldset rounded-box mt-6 w-md border border-[#b8d2f1] bg-white p-4">
            <legend className="fieldset-legend text-black">
              {t('getting_profile')}
            </legend>

            <div className="skeleton h-[1.125rem] w-[4.375rem]" />
            <div className="skeleton h-[2.5rem] w-[25.887rem]" />

            <div className="skeleton h-[1.125rem] w-[4.375rem]" />
            <div className="skeleton h-[2.5rem] w-[25.887rem]" />

            <div className="skeleton h-[1.125rem] w-[4.375rem]" />
            <div className="skeleton h-[2.5rem] w-[25.887rem]" />

            <div className="skeleton h-[1.125rem] w-[4.375rem]" />
            <div className="skeleton h-[2.5rem] w-[25.887rem]" />

            <div className="skeleton h-[1.125rem] w-[4.375rem]" />
            <div className="skeleton h-[5rem] w-[25.887rem]" />
          </fieldset>
          <div className="mt-6 flex flex-col max-sm:items-center max-sm:gap-y-3 max-sm:pb-6 sm:flex-row sm:justify-between">
            <div className="skeleton h-[1.499rem] w-[7.774rem]" />
            <div className="skeleton h-[1.499rem] w-[7.774rem]" />
            <div className="skeleton h-[1.499rem] w-[7.774rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
