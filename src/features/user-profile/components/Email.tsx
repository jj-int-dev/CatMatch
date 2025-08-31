import React from 'react';
import { MdEmail } from 'react-icons/md';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function Email({
  isEditMode,
  value
}: FormComponentProps) {
  return (
    <p className="flex items-center justify-center gap-x-2 pt-4 font-semibold text-black lg:justify-start">
      <MdEmail
        className={`${isEditMode ? 'mr-3 size-8' : 'size-5'} text-indigo-500`}
      />{' '}
      {value}
    </p>
  );
});
