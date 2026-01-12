import { useState, useMemo, type FormEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import {
  createDiscoveryPreferencesValidator,
  type DiscoveryPreferencesSchema
} from './validators/discoveryPreferencesValidator';
import type { UpdateDiscoveryPreferencesRequestBody } from './types/UpdateDiscoveryPreferencesRequestBody';
import { useDiscoveryPreferencesStore } from './stores/discovery-preferences-store';
import useGetDiscoveryPreferences from './hooks/useGetDiscoveryPreferences';
import useUpdateDiscoveryPreferences from './hooks/useUpdateDiscoveryPreferences';
import useAddressSuggestions from '../../hooks/useGetAddressSuggestions';
import DiscoveryPreferencesSkeleton from './DiscoveryPreferencesSkeleton';

export function DiscoveryPreferencesDialog() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  // Recreate the schema whenever the language changes so that error messages are in the correct language
  const formSchema = useMemo(
    () => createDiscoveryPreferencesValidator(),
    [i18n.language]
  );

  const { showDiscoveryPreferencesDialog, setShowDiscoveryPreferencesDialog } =
    useDiscoveryPreferencesStore();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset,
    setValue,
    watch
  } = useForm<DiscoveryPreferencesSchema>({
    resolver: zodResolver(formSchema) as any
  });

  const closeDiscoveryPreferencesDialog = () =>
    setShowDiscoveryPreferencesDialog(false);

  const { isPending: isLoadingDiscoveryPrefs, data } =
    useGetDiscoveryPreferences();

  const discoveryPreferences = data?.discoveryPreferences;

  const {
    isPending: isUpdatingDiscoveryPrefs,
    mutateAsync: updateDiscoveryPreferences
  } = useUpdateDiscoveryPreferences();

  const [maxDistanceDisplayKm, setMaxDistanceDisplayKm] = useState(
    discoveryPreferences?.maxDistanceKm ?? 1
  );
  const [preferencesErrors, setPreferencesErrors] = useState<string[]>([]);
  const [locationDisplayName, setLocationDisplayName] = useState<string>('');
  const [searchLocLatitude, setSearchLocLatitude] = useState<number | null>(
    null
  );
  const [searchLocLongitude, setSearchLocLongitude] = useState<number | null>(
    null
  );
  const [locationInput, setLocationInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [useMyLocation, setUseMyLocation] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Use address suggestions hook
  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useAddressSuggestions(locationInput, i18n.language);

  // Sync maxDistanceDisplayKm with fetched data when it becomes available
  useEffect(() => {
    if (discoveryPreferences?.maxDistanceKm !== undefined) {
      setMaxDistanceDisplayKm(discoveryPreferences.maxDistanceKm);
    }
  }, [discoveryPreferences?.maxDistanceKm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateDisplayedMaxDistance = (e: FormEvent<HTMLInputElement>) => {
    setMaxDistanceDisplayKm(+(e.target as HTMLInputElement).value);
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocationInput(value);
    setShowSuggestions(true);
    setLocationError('');

    // Clear coordinates when user types
    if (value.trim() === '') {
      setSearchLocLatitude(null);
      setSearchLocLongitude(null);
      setLocationDisplayName('');
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setLocationInput(suggestion.formatted);
    setLocationDisplayName(suggestion.formatted);
    setSearchLocLatitude(suggestion.lat);
    setSearchLocLongitude(suggestion.lon);
    setShowSuggestions(false);
    setLocationError('');
  };

  const handleUseMyLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUseMyLocation(checked);

    if (checked) {
      // Get user's current location
      setIsGettingLocation(true);
      setLocationError('');
      setLocationInput('');
      setLocationDisplayName('');
      setShowSuggestions(false);

      if (!navigator.geolocation) {
        setLocationError(t('geolocation_not_supported'));
        setUseMyLocation(false);
        setIsGettingLocation(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocLatitude(position.coords.latitude);
          setSearchLocLongitude(position.coords.longitude);
          setIsGettingLocation(false);
          setLocationError('');
        },
        (error) => {
          setIsGettingLocation(false);
          setUseMyLocation(false);
          setSearchLocLatitude(null);
          setSearchLocLongitude(null);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(t('geolocation_permission_denied'));
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(t('geolocation_position_unavailable'));
              break;
            case error.TIMEOUT:
              setLocationError(t('geolocation_timeout'));
              break;
            default:
              setLocationError(t('geolocation_error'));
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Unchecked: enable location input and clear coordinates
      setSearchLocLatitude(null);
      setSearchLocLongitude(null);
      setLocationError('');
    }
  };

  const handleSaveDiscoveryPreferences = async (
    formData: DiscoveryPreferencesSchema
  ) => {
    clearErrors();

    // Collect all errors
    const errors: string[] = [];

    // Check for location errors
    if (searchLocLatitude === null || searchLocLongitude === null) {
      errors.push(t('invalid_location'));
    }

    // Include any existing locationError
    if (locationError) {
      errors.push(locationError);
    }

    // If there are errors, show them and stop
    if (errors.length > 0) {
      setPreferencesErrors(errors);
      return;
    }

    setPreferencesErrors([]);
    // At this point, we've validated that searchLocLatitude and searchLocLongitude are not null
    const requestBody: UpdateDiscoveryPreferencesRequestBody = {
      minAge: formData.minAge,
      maxAge: formData.maxAge,
      gender: formData.gender,
      maxDistanceKm: formData.maxDistanceKm,
      neutered: formData.neutered,
      locationDisplayName: locationDisplayName.trim(),
      searchLocLatitude: searchLocLatitude!,
      searchLocLongitude: searchLocLongitude!
    };

    try {
      await updateDiscoveryPreferences(requestBody);
      closeDiscoveryPreferencesDialog();
      navigate('/discovery');
    } catch (err) {
      setPreferencesErrors([(err as Error).message]);
    }
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

  if (!showDiscoveryPreferencesDialog) return null;

  return (
    <dialog
      id="discoveryPreferencesDialog"
      open={showDiscoveryPreferencesDialog}
      className="modal modal-bottom sm:modal-middle"
    >
      {isLoadingDiscoveryPrefs || isUpdatingDiscoveryPrefs ? (
        <DiscoveryPreferencesSkeleton />
      ) : (
        <div className="modal-box mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-0 shadow-2xl">
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {t('preferences')}
              </h3>
              <form method="dialog">
                <button
                  onClick={closeDiscoveryPreferencesDialog}
                  className="btn btn-circle btn-ghost btn-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  ✕
                </button>
              </form>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {t('preferences_modal_subtitle')}
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
            {/* Error Messages Display */}
            {preferencesErrors.length > 0 && (
              <div className="border-error/20 bg-error/5 mb-6 rounded-xl border p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="mt-0.5 mr-3 flex-shrink-0">
                    <svg
                      className="text-error h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-error mb-2 text-sm font-semibold">
                      {t('prefs_form_errors_title')}
                    </h4>
                    <ul className="space-y-1">
                      {preferencesErrors.map((error, index) => (
                        <li
                          key={index}
                          className="text-error flex items-center text-sm"
                        >
                          <span className="bg-error mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Age Section */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  {t('age_range_months')}
                </label>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-500">
                      {t('min_age')}
                    </label>
                    <input
                      id="minAge"
                      type="number"
                      className="input input-bordered focus:border-primary focus:ring-primary/20 w-full bg-gray-50 transition-all focus:bg-white focus:ring-2"
                      defaultValue={discoveryPreferences?.minAge ?? 0}
                      {...register('minAge')}
                      placeholder="0"
                    />
                  </div>
                  <div className="pt-5 font-medium text-gray-400">-</div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-500">
                      {t('max_age')}
                    </label>
                    <input
                      id="maxAge"
                      type="number"
                      defaultValue={discoveryPreferences?.maxAge ?? 480}
                      {...register('maxAge')}
                      className="input input-bordered focus:border-primary focus:ring-primary/20 w-full bg-gray-50 transition-all focus:bg-white focus:ring-2"
                      placeholder="480"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Section */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  {t('gender')}
                </label>
                <select
                  id="gender"
                  defaultValue={discoveryPreferences?.gender ?? ''}
                  {...register('gender')}
                  className="select select-bordered focus:border-primary focus:ring-primary/20 w-full bg-gray-50 transition-all focus:bg-white focus:ring-2"
                >
                  <option value="" disabled hidden>
                    {t('select_a_gender')}
                  </option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                </select>
              </div>

              {/* Location Section */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  {t('location')}
                </label>
                <div className="relative mb-3">
                  <input
                    id="location"
                    type="text"
                    ref={locationInputRef}
                    value={locationInput}
                    onChange={handleLocationInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={useMyLocation}
                    className="input input-bordered focus:border-primary focus:ring-primary/20 w-full bg-gray-50 transition-all focus:bg-white focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder={t('location_field_placeholder')}
                  />

                  {/* Loading indicator for suggestions */}
                  {isLoadingSuggestions && locationInput.trim().length >= 3 && (
                    <div className="absolute top-3 right-3">
                      <div className="loading loading-spinner loading-xs text-primary"></div>
                    </div>
                  )}

                  {/* Address Suggestions Dropdown */}
                  {showSuggestions &&
                    suggestionsData?.results &&
                    suggestionsData.results.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                      >
                        {suggestionsData.results.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            <div className="font-medium text-gray-900">
                              {suggestion.address_line1}
                            </div>
                            {suggestion.address_line2 && (
                              <div className="text-sm text-gray-600">
                                {suggestion.address_line2}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Location error message */}
                {locationError && (
                  <div className="text-error mb-3 text-sm">{locationError}</div>
                )}

                <div className="flex items-center">
                  <input
                    id="useMyLocation"
                    type="checkbox"
                    checked={useMyLocation}
                    onChange={handleUseMyLocationChange}
                    className="checkbox checkbox-primary checkbox-sm"
                    disabled={isGettingLocation}
                  />
                  <label
                    htmlFor="useMyLocation"
                    className="ml-2 cursor-pointer text-sm text-gray-700"
                  >
                    {t('use_current_location')}
                    {isGettingLocation && (
                      <span className="loading loading-spinner loading-xs ml-2"></span>
                    )}
                  </label>
                </div>
              </div>

              {/* Max Distance Section */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('max_distance')}
                  </label>
                  <span className="text-primary text-lg font-bold">{`${maxDistanceDisplayKm} km`}</span>
                </div>
                <input
                  id="maxDistanceKm"
                  type="range"
                  min="1"
                  max="250"
                  defaultValue={discoveryPreferences?.maxDistanceKm ?? 1}
                  {...register('maxDistanceKm')}
                  onInput={updateDisplayedMaxDistance}
                  className="range range-primary w-full"
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>250 km</span>
                </div>
              </div>

              {/* Neutered Section */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      {t('neutered_label')}
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      {t('neutered_modal_desc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    defaultChecked={discoveryPreferences?.neutered ?? false}
                    {...register('neutered')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="btn btn-outline btn-gray flex-1 rounded-xl border-gray-300 py-3 font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                onClick={closeDiscoveryPreferencesDialog}
              >
                {t('btn_cancel')}
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSubmit(
                  handleSaveDiscoveryPreferences,
                  handleSaveDiscoveryPreferencesFailure
                )}
                className="btn btn-success from-success to-success/90 flex-1 rounded-xl border-none bg-gradient-to-r py-3 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {t('search')} 🐈
              </button>
            </div>
          </div>
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeDiscoveryPreferencesDialog}>close</button>
      </form>
    </dialog>
  );
}
