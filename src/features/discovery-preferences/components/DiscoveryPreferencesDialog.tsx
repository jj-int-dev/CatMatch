import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

export const openDiscoveryPreferencesDialog = () => {
  (
    document.getElementById(
      'discoveryPreferencesDialog'
    ) as HTMLDialogElement | null
  )?.showModal();
};

export function DiscoveryPreferencesDialog() {
  const { t } = useTranslation();

  const closeDiscoveryPreferencesDialog = () =>
    (
      document.getElementById(
        'discoveryPreferencesDialog'
      ) as HTMLDialogElement | null
    )?.close();

  const [maxDistanceKm, setMaxDistanceKm] = useState(40);

  const updateDisplayedMaxDistance = (e: FormEvent<HTMLInputElement>) => {
    setMaxDistanceKm(+(e.target as HTMLInputElement).value);
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
              <input
                id="age"
                type="number"
                className="input w-fieldset-input-md mt-2 bg-[#f9f9f9]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="label">{t('gender')}</label>
              <select
                id="gender"
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
                <span>{`${maxDistanceKm} km`}</span>
              </div>
              <input
                type="range"
                min="1"
                max="250"
                value={maxDistanceKm}
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
