import { useState, useMemo, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import {
  createDiscoveryPreferencesValidator,
  type DiscoveryPreferencesSchema
} from '../validators/discovery-preferences-validator';

export const openDiscoveryPreferencesDialog = () => {
  (
    document.getElementById(
      'discoveryPreferencesDialog'
    ) as HTMLDialogElement | null
  )?.showModal();
};

export function DiscoveryPreferencesDialog() {
  const { i18n, t } = useTranslation();

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formSchema = useMemo(
    () => createDiscoveryPreferencesValidator(),
    [i18n.language]
  );

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset
  } = useForm<DiscoveryPreferencesSchema>({
    resolver: zodResolver(formSchema)
  });

  const closeDiscoveryPreferencesDialog = () =>
    (
      document.getElementById(
        'discoveryPreferencesDialog'
      ) as HTMLDialogElement | null
    )?.close();

  const [maxDistanceDisplayKm, setMaxDistanceDisplayKm] = useState(1);
  const [preferencesErrors, setPreferencesErrors] = useState<string[]>([]);

  const updateDisplayedMaxDistance = (e: FormEvent<HTMLInputElement>) => {
    setMaxDistanceDisplayKm(+(e.target as HTMLInputElement).value);
  };

  const handleSaveDiscoveryPreferences = async (
    formData: DiscoveryPreferencesSchema
  ) => {
    clearErrors();
    setPreferencesErrors([]);
    // send prefs to backend ..
  };

  const handleSaveDiscoveryPreferencesAndSearch = async (
    formData: DiscoveryPreferencesSchema
  ) => {
    clearErrors();
    setPreferencesErrors([]);
    // send prefs to backend ..
    reset();
    closeDiscoveryPreferencesDialog();
  };

  const handleSaveDiscoveryPreferencesFailure = (
    formErrors: FieldErrors<DiscoveryPreferencesSchema>
  ) => {
    const errorMsgs: string[] = [];

    if (formErrors.minAge?.message != null) {
      errorMsgs.push(formErrors.minAge.message);
    }
    if (formErrors.maxAge?.message != null) {
      errorMsgs.push(formErrors.maxAge.message);
    }
    if (formErrors.gender?.message != null) {
      errorMsgs.push(formErrors.gender.message);
    }
    if (formErrors.maxDistanceKm?.message != null) {
      errorMsgs.push(formErrors.maxDistanceKm.message);
    }
    if (formErrors.neutered?.message != null) {
      errorMsgs.push(formErrors.neutered.message);
    }

    setPreferencesErrors(errorMsgs);
  };

  return (
    <dialog id="discoveryPreferencesDialog" className="modal">
      <div className="modal-box w-md bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 bg-transparent text-black transition-colors duration-200 hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.12)] hover:text-black">
            ✕
          </button>
        </form>
        <div className="mt-6 mb-8">
          <fieldset className="fieldset rounded-box mt-6 gap-y-4 border border-[#b8d2f1] bg-white p-4">
            <legend className="fieldset-legend text-black">
              {t('preferences')}
            </legend>

            <div>
              <label className="label">{t('age')}</label>
              <div className="mt-2 flex w-40 justify-between">
                <div>
                  <input
                    id="minAge"
                    type="number"
                    {...register('minAge')}
                    className="input w-16 bg-[#f9f9f9]"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">-</div>
                <div>
                  <input
                    id="maxAge"
                    type="number"
                    {...register('maxAge')}
                    className="input w-16 bg-[#f9f9f9]"
                    placeholder="480"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">{t('gender')}</label>
              <select
                id="gender"
                {...register('gender')}
                className="select w-fieldset-input-md mt-2 bg-[#f9f9f9]"
              >
                <option value="" disabled hidden>
                  {t('select_a_gender')}
                </option>
                <option value="Male">{t('male')}</option>
                <option value="Female">{t('female')}</option>
              </select>
            </div>

            <div>
              <div className="w-fieldset-input-md flex justify-between">
                <label className="label">{t('max_distance_km')}</label>
                <span>{`${maxDistanceDisplayKm} km`}</span>
              </div>
              <input
                id="maxDistanceKm"
                type="range"
                min="1"
                max="250"
                defaultValue="1"
                {...register('maxDistanceKm')}
                onInput={updateDisplayedMaxDistance}
                className="range range-neutral w-fieldset-input-md mt-2"
              />
            </div>

            <div className="mt-2">
              <label className="label text-[13px]">
                {t('neutered')}
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-xs mt-0.5 ml-2"
                />
              </label>
            </div>
          </fieldset>
          {preferencesErrors.length > 0 && (
            <div className="mt-2">
              <ul className="list-inside list-disc">
                {preferencesErrors.map((errMsg) => (
                  <li key={errMsg} className="text-sm text-red-600">
                    {errMsg}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="modal-action">
          <button
            className="btn btn-sm border-[#4181fa] bg-[#4181fa] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
            onClick={closeDiscoveryPreferencesDialog}
          >
            {t('save')}
          </button>
          <button
            className="btn btn-sm border-[#36b37e] bg-[#36b37e] text-white transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-sm"
            onClick={closeDiscoveryPreferencesDialog}
          >
            {t('search')} 🐈
          </button>
        </div>
      </div>
    </dialog>
  );
}
