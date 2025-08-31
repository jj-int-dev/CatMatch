import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function DisplayName({
  isEditMode,
  value,
  onChange
}: FormComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      {!isEditMode && (
        <h1 className="pt-8 text-3xl font-bold text-black lg:pt-0">
          {!value || value.trim().length < 1 ? t('enter_your_name') : value}
        </h1>
      )}
      {isEditMode && (
        <input
          value={value}
          onChange={onChange}
          name="displayName"
          className="w-4/5 pt-8 text-3xl font-bold text-black active:border-indigo-500 lg:pt-0"
        />
      )}
    </>
  );
});
