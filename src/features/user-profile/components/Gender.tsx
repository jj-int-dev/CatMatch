import React from 'react';
import { FaTransgenderAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function Gender({
  isEditMode,
  value,
  onChange
}: FormComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      {!isEditMode && (
        <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
          <FaTransgenderAlt className="size-5 text-indigo-500" />
          {!value || value.trim().length < 1
            ? t('please_add_your_gender')
            : t(value)}
        </p>
      )}
      {isEditMode && (
        <div className="mt-4 flex flex-row gap-x-4.5">
          <FaTransgenderAlt className="size-8 self-center text-indigo-500" />
          <select
            name="gender"
            defaultValue={value ?? t('Man')}
            className="select-md select-ghost rounded-lg bg-indigo-500 p-2"
            onChange={onChange}
          >
            <option>{t('Man')}</option>
            <option>{t('Woman')}</option>
          </select>
        </div>
      )}
    </>
  );
});
