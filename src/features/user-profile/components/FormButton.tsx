import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormButtonComponentProps } from '../types/FormTypes';

export default React.memo(function FormButton({
  isEditMode,
  onEditPress,
  onSavePress
}: FormButtonComponentProps) {
  const { t } = useTranslation();
  return (
    <>
      {!isEditMode && (
        <div className="pt-6 pb-8">
          <button
            className="rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-900"
            onClick={onEditPress}
          >
            {t('edit')}
          </button>
        </div>
      )}
      {isEditMode && (
        <div className="pt-6 pb-8">
          <button
            className="rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-900"
            onClick={onSavePress}
          >
            {t('save')}
          </button>
        </div>
      )}
    </>
  );
});
