import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaRegCalendar } from 'react-icons/fa6';
import { getAgeFromDateOfBirth } from '../utils/getAgeFromDateOfBirth';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function Age({
  isEditMode,
  value,
  onChange
}: FormComponentProps) {
  const { t } = useTranslation();

  const getAgeText = (): string => {
    const noAgeString = t('please_enter_your_age');
    if (!value) return noAgeString;
    const age = getAgeFromDateOfBirth(value);
    return age >= 0 ? `${age} ${t('years_old')}` : noAgeString;
  };
  return (
    <>
      {!isEditMode && (
        <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
          <FaRegCalendar className="size-5 text-indigo-500" />
          {getAgeText()}
        </p>
      )}

      {isEditMode && (
        <div className="mt-4 flex flex-row gap-x-4.5">
          <FaRegCalendar className="size-8 self-center text-indigo-500" />
          <input
            onChange={onChange}
            type="date"
            name="dateOfBirth"
            className="input-md rounded-lg bg-indigo-500 p-2"
          />
        </div>
      )}
    </>
  );
});
