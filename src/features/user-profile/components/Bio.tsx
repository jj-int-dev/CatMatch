import React from 'react';
import type { FormComponentProps } from '../types/FormTypes';

export default React.memo(function Bio({
  isEditMode,
  value,
  onChange
}: FormComponentProps) {
  return (
    <>
      {!isEditMode && (
        <p className="max-w-[70%] pt-5 text-sm text-wrap text-black">
          {!value || value.trim().length < 1 ? 'Please enter a bio' : value}
        </p>
      )}
      {isEditMode && (
        <div className="mt-8">
          <textarea
            name="bio"
            className="textarea w-lg rounded-lg bg-indigo-500"
            placeholder="Bio"
            onChange={onChange}
            value={value}
          ></textarea>
        </div>
      )}
    </>
  );
});
