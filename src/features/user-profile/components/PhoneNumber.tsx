import React from 'react';
import { IoPhonePortrait } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import PhoneNumberIcon from '../../../assets/phone_number_icon.svg?react';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function PhoneNumber({
  isEditMode,
  value,
  onChange
}: FormComponentProps) {
  const { t } = useTranslation();
  const e164PhoneNumberFormat = `^\+[1-9]\d{1,14}$`;

  return (
    <>
      {!isEditMode && (
        <p className="flex items-center justify-center gap-x-2 pt-2 text-xs font-semibold text-black lg:justify-start lg:text-sm">
          <IoPhonePortrait className="size-5 text-indigo-500" />
          {!value || value.trim().length < 1
            ? t('please_enter_a_phone_number')
            : value}
        </p>
      )}

      {isEditMode && (
        <div className="mt-4 flex flex-row">
          <IoPhonePortrait className="size-8 self-center text-indigo-500" />
          <PhoneNumberIcon />
          <input
            name="phoneNumber"
            type="tel"
            className="input-md rounded-lg border-pink-300 bg-indigo-500 p-2 tabular-nums placeholder:text-white"
            required
            placeholder="+14155552671"
            pattern={e164PhoneNumberFormat}
            maxLength={16}
            onChange={onChange}
          />
          <p className="validator-hint">{t('must_be_10_digits')}</p>
        </div>
      )}
    </>
  );
});
