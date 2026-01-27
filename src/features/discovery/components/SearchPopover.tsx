import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useCallback } from 'react';
import useGetAddressSuggestions from '../../../hooks/useGetAddressSuggestions';
import { IoClose, IoLocationOutline } from 'react-icons/io5';
import { FaCat, FaNeuter } from 'react-icons/fa';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import { GiPathDistance } from 'react-icons/gi';
import type { SearchFilters } from '../types/SearchFilters';
import type { AddressSuggestionSchema } from '../../../validators/addressSuggestionValidators';
import { searchFiltersValidator } from '../validators/searchFiltersValidator';

type SearchPopoverProps = {
  isOpen: boolean;
  isSearching: boolean;
  searchFilters: SearchFilters;
  onClose: () => void;
  onSearch: () => Promise<void>;
  onReset: () => void;
  onFiltersChange: (newFilters: SearchFilters) => void;
};

export default function SearchPopover({
  isOpen,
  isSearching,
  searchFilters,
  onClose,
  onSearch,
  onReset,
  onFiltersChange
}: SearchPopoverProps) {
  const { i18n, t } = useTranslation();

  const popoverRef = useRef<HTMLDialogElement>(null);

  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestionSchema[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    data: fetchedAddressSuggestions,
    isLoading: isLoadingAddressSuggestions
  } = useGetAddressSuggestions(
    searchFilters.location.formatted,
    i18n.language.split('-')[0]
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocationError(null);

      onFiltersChange({
        ...searchFilters,
        locationSource: 'client-custom-location',
        location: {
          formatted: value,
          city: null,
          latitude: null,
          longitude: null
        }
      });

      if (
        fetchedAddressSuggestions &&
        fetchedAddressSuggestions.results.length > 0
      ) {
        setAddressSuggestions(fetchedAddressSuggestions.results);
        setShowAddressSuggestions(true);
      } else {
        setAddressSuggestions([]);
        setShowAddressSuggestions(false);
      }
    },
    [fetchedAddressSuggestions, searchFilters]
  );

  const handleAddressSelect = useCallback(
    (address: AddressSuggestionSchema) => {
      onFiltersChange({
        ...searchFilters,
        locationSource: 'client-custom-location',
        location: {
          formatted: address.formatted,
          city: address.city,
          latitude: address.lat,
          longitude: address.lon
        }
      });
      setShowAddressSuggestions(false);
    },
    [searchFilters]
  );

  // Handle dialog open/close
  useEffect(() => {
    if (isOpen) {
      popoverRef.current?.showModal();
    } else {
      popoverRef.current?.close();
    }
  }, [isOpen]);

  // Handle click outside popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowAddressSuggestions(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Handle field changes
  const handleFieldChange = (field: keyof SearchFilters, value: any) => {
    const newFilters = { ...searchFilters, [field]: value };
    onFiltersChange(newFilters);
  };

  const requestUserLocation = (shouldRequest: boolean) => {
    setLocationError(null);

    if (!shouldRequest) {
      onFiltersChange({
        ...searchFilters,
        locationSource: 'client-ip',
        location: {
          formatted: '',
          latitude: null,
          longitude: null,
          city: null
        }
      });
      return;
    }

    setShowAddressSuggestions(false);
    onFiltersChange({
      ...searchFilters,
      locationSource: 'client-current-location',
      location: {
        formatted: '',
        city: null,
        latitude: null,
        longitude: null
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onFiltersChange({
          ...searchFilters,
          location: {
            formatted: '',
            city: null,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      (err) => {
        onFiltersChange({
          ...searchFilters,
          locationSource: 'client-ip',
          location: {
            formatted: '',
            city: null,
            latitude: null,
            longitude: null
          }
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60_000
      }
    );
  };

  const handleSearch = async () => {
    const { isValid, error } = searchFiltersValidator(searchFilters, t);

    if (!isValid) {
      setLocationError(error);
      return;
    }

    await onSearch();
  };

  return (
    <dialog
      ref={popoverRef}
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
      aria-labelledby="search-popover-title"
      onClose={onClose}
    >
      <div className="modal-box w-full max-w-2xl p-0">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-2xl font-bold">{t('search_filters')}</h3>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            disabled={isSearching}
          >
            <IoClose className="size-6" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {/* Location Field */}
          <div className="mb-6">
            <div className="mb-4 flex items-center">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={
                    searchFilters.locationSource === 'client-current-location'
                  }
                  onChange={(e) => requestUserLocation(e.target.checked)}
                />
                <span className="label-text font-semibold">
                  {t('use_current_location')}
                </span>
              </label>
            </div>

            <label className="label">
              <span className="label-text text-lg font-semibold">
                <IoLocationOutline className="mr-2 inline size-5" />
                {t('location')}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t(
                  searchFilters.locationSource === 'client-current-location'
                    ? 'using_current_location'
                    : 'address_placeholder'
                )}
                className="input input-bordered w-full"
                autoComplete="off"
                value={searchFilters.location.formatted}
                onChange={handleAddressChange}
                disabled={
                  searchFilters.locationSource === 'client-current-location'
                }
              />

              {/* Address Suggestions Dropdown */}
              {showAddressSuggestions && addressSuggestions.length > 0 && (
                <div className="rounded-box bg-base-100 absolute z-10 mt-1 w-full border shadow-lg">
                  {addressSuggestions.map((address, index) => (
                    <button
                      key={index}
                      className="hover:bg-base-200 block w-full px-4 py-3 text-left"
                      onClick={() => handleAddressSelect(address)}
                    >
                      {address.formatted}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {t('search_location_desc')}
            </p>
            {locationError && (
              <p className="mt-2 text-sm text-red-500">{locationError}</p>
            )}
          </div>

          {/* Max Distance Field */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <GiPathDistance className="mr-2 inline size-5" />
                {`${t('max_distance')}: ${Math.trunc(searchFilters.maxDistanceMeters / 1000)} km`}
              </span>
            </label>
            <input
              type="range"
              min="1000"
              max="250000"
              value={searchFilters.maxDistanceMeters}
              onChange={(e) =>
                handleFieldChange('maxDistanceMeters', parseInt(e.target.value))
              }
              className="range range-primary w-full"
            />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>1 km</span>
              <span>50 km</span>
              <span>100 km</span>
              <span>150 km</span>
              <span>200 km</span>
              <span>250 km</span>
            </div>
          </div>

          {/* Age Range Fields */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <FaCat className="mr-2 inline size-5" />
                {t('age_range_weeks')}
              </span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">
                  <span className="label-text">{t('min_age')}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1920"
                  value={searchFilters.minAgeWeeks}
                  onChange={(e) =>
                    handleFieldChange(
                      'minAgeWeeks',
                      Math.min(parseInt(e.target.value) || 0, 1920)
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">{t('max_age')}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1920"
                  value={searchFilters.maxAgeWeeks}
                  onChange={(e) =>
                    handleFieldChange(
                      'maxAgeWeeks',
                      Math.min(parseInt(e.target.value) || 1920, 1920)
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {`${t('age_range')}: ${searchFilters.minAgeWeeks} - ${searchFilters.maxAgeWeeks} ${t('weeks')} (${Math.round(searchFilters.minAgeWeeks / 4)} - ${Math.round(searchFilters.maxAgeWeeks / 4)} ${t('months')})`}
            </p>
          </div>

          {/* Gender Field */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                {t('gender')}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn ${searchFilters.gender === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'All')}
              >
                {t('all_genders')}
              </button>
              <button
                className={`btn ${searchFilters.gender === 'Male' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Male')}
              >
                <TbGenderMale className="mr-2 size-5" />
                {t('male')}
              </button>
              <button
                className={`btn ${searchFilters.gender === 'Female' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Female')}
              >
                <TbGenderFemale className="mr-2 size-5" />
                {t('female')}
              </button>
            </div>
          </div>

          {/* Neutered Field */}
          <div className="mb-8">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <FaNeuter className="mr-2 inline size-5" />
                {t('neutered_status')}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn ${searchFilters.neutered === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('neutered', 'All')}
              >
                {t('all')}
              </button>
              <button
                className={`btn ${searchFilters.neutered === 'Neutered Only' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('neutered', 'Neutered Only')}
              >
                {t('neutered_only')}
              </button>
            </div>
          </div>
        </div>

        {/* Popover Footer with Actions */}
        <div className="flex flex-col gap-3 border-t p-6 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="btn btn-ghost"
              disabled={isSearching}
            >
              {t('reset')}
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSearching}
            >
              {t('btn_cancel')}
            </button>
          </div>
          <button
            onClick={handleSearch}
            className="btn btn-primary gap-2"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="loading loading-spinner"></span>
                {t('searching')}
              </>
            ) : (
              <>{t('discovery_search_btn')}</>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>{t('close')}</button>
      </form>
    </dialog>
  );
}
