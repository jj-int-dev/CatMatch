import { useTranslation } from 'react-i18next';

export default function () {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-6 mb-8">
        <fieldset className="fieldset rounded-box mt-6 gap-y-4 border border-[#b8d2f1] bg-white p-4">
          <legend className="fieldset-legend text-black">
            {t('preferences')}
          </legend>

          <div>
            <label className="label">{t('age')}</label>
            <div className="mt-2 flex w-40 justify-between">
              <div>
                <div className="skeleton h-10 w-16" />
              </div>
              <div className="flex items-center">-</div>
              <div>
                <div className="skeleton h-10 w-16" />
              </div>
            </div>
          </div>

          <div>
            <label className="label">{t('gender')}</label>
            <div className="w-fieldset-input-md skeleton mt-2 h-10" />
          </div>

          <div>
            <div className="w-fieldset-input-md flex justify-between">
              <label className="label">{t('max_distance_km')}</label>
              <span>0 km</span>
            </div>
            <div className="skeleton w-fieldset-input-md mt-2 h-6" />
          </div>

          <div className="mt-2">
            <label className="label text-[13px]">
              {t('neutered')}
              <div className="skeleton mt-0.5 ml-2 h-4 w-4" />
            </label>
          </div>
        </fieldset>
      </div>
      <div className="modal-action">
        <button className="skeleton h-8 w-20" />
      </div>
    </>
  );
}
