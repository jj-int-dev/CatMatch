import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect, useCallback } from 'react';
import useGetAddressSuggestions from '../../../hooks/useGetAddressSuggestions';
import { IoClose, IoLocationOutline } from 'react-icons/io5';
import { FaCat, FaNeuter } from 'react-icons/fa';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import { GiPathDistance } from 'react-icons/gi';
import type { LocationSource, SearchFilters } from '../types/SearchFilters';
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

  const { data: fetchedAddressSuggestions } = useGetAddressSuggestions(
    searchFilters.location.formatted,
    i18n.language.split('-')[0],
    searchFilters.locationSource
  );

  const handleAddressChange = (addressSearchText: string) => {
    setLocationError(null);

    // If the address field is empty, revert to client-ip
    if (addressSearchText.trim().length === 0) {
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
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    // User is typing an address, set locationSource to client-custom-location
    // and update the formatted field, but clear the other location fields
    // since they haven't selected an address yet
    onFiltersChange({
      ...searchFilters,
      locationSource: 'client-custom-location',
      location: {
        formatted: addressSearchText,
        city: null,
        latitude: null,
        longitude: null
      }
    });

    // Update address suggestions display based on fetched data
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
  };

  useEffect(() => {
    if (!isOpen) return;

    // Only show suggestions if user is typing and hasn't selected an address yet
    // If latitude/longitude exist, it means user has completed their selection
    // so we should NOT show the dropdown (even if new suggestions arrive)
    if (
      searchFilters.locationSource === 'client-custom-location' &&
      !searchFilters.location.latitude &&
      !searchFilters.location.longitude &&
      fetchedAddressSuggestions &&
      fetchedAddressSuggestions.results.length > 0
    ) {
      setAddressSuggestions(fetchedAddressSuggestions.results);
      setShowAddressSuggestions(true);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  }, [
    isOpen,
    fetchedAddressSuggestions,
    searchFilters.locationSource,
    searchFilters.location.latitude,
    searchFilters.location.longitude
  ]);

  const handleAddressSelect = (address: AddressSuggestionSchema) => {
    // Update the input field with the selected address
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
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  useEffect(() => {
    if (isOpen) {
      popoverRef.current?.showModal();
    } else {
      popoverRef.current?.close();
    }
  }, [isOpen]);

  const handleClickOutside = useCallback(() => {
    const { isValid } = searchFiltersValidator(searchFilters, t);

    if (!isValid) {
      // Don't close if filters are invalid
      setLocationError(t('invalid_address'));
      return;
    }

    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
    onClose();
  }, [searchFilters, t, onClose]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        handleClickOutside();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [handleClickOutside]);

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

    setAddressSuggestions([]);
    setShowAddressSuggestions(false);

    // First, set the locationSource to client-current-location
    const newFilters = {
      ...searchFilters,
      locationSource: 'client-current-location' as LocationSource,
      location: {
        formatted: '',
        city: null,
        latitude: null,
        longitude: null
      }
    };

    onFiltersChange(newFilters);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Use the updated filters with locationSource already set
        onFiltersChange({
          ...newFilters,
          location: {
            formatted: '',
            city: null,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      (_error) => {
        setLocationError(t('current_location_error'));
        // Revert to client-ip on error
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

  const handleCloseClick = () => {
    const { isValid, error } = searchFiltersValidator(searchFilters, t);

    if (!isValid) {
      setLocationError(error);
      return;
    }

    onClose();
  };

  return (
    <dialog
      ref={popoverRef}
      className={`modal modal-bottom sm:modal-middle ${isOpen ? 'modal-open' : ''}`}
      aria-labelledby="search-popover-title"
      onClose={onClose}
    >
      <div className="modal-box bg-base-100 w-full max-w-3xl">
        {/* Header */}
        <div className="border-base-200 mb-6 flex items-center justify-between border-b pb-4">
          <h3
            id="search-popover-title"
            className="text-base-content text-2xl font-bold"
          >
            {t('search_filters')}
          </h3>
          <button
            onClick={handleCloseClick}
            className="btn btn-circle btn-ghost btn-sm"
            disabled={isSearching}
          >
            <IoClose className="size-6" />
          </button>
        </div>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto">
          {/* Location Section */}
          <div className="card bg-base-200/50">
            <div className="card-body">
              <h4 className="card-title text-base-content mb-4 flex items-center gap-2 text-lg">
                <IoLocationOutline className="size-6" />
                {t('location')}
              </h4>

              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={
                    searchFilters.locationSource === 'client-current-location'
                  }
                  onChange={(e) => requestUserLocation(e.target.checked)}
                />
                <span className="label-text">{t('use_current_location')}</span>
              </label>

              <div className="form-control">
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
                    onChange={(e) => handleAddressChange(e.target.value)}
                    disabled={
                      searchFilters.locationSource === 'client-current-location'
                    }
                  />

                  {showAddressSuggestions && addressSuggestions.length > 0 && (
                    <div className="bg-base-100 border-base-300 absolute z-10 mt-1 w-full rounded-lg border shadow-lg">
                      {addressSuggestions.map((address, index) => (
                        <button
                          key={index}
                          className="hover:bg-base-200 text-base-content block w-full px-4 py-3 text-left transition-colors"
                          onClick={() => handleAddressSelect(address)}
                        >
                          {address.formatted}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <label className="label">
                  <span className="label-text-alt text-base-content/70 break-words whitespace-normal">
                    {t('search_location_desc')}
                  </span>
                </label>
                {locationError && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {locationError}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content flex items-center gap-2 text-lg font-semibold">
                <GiPathDistance className="size-5" />
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
            <div className="text-base-content/70 mt-2 flex w-full justify-between px-2 text-xs">
              <span>1 km</span>
              <span>60 km</span>
              <span>115 km</span>
              <span>175 km</span>
              <span>250 km</span>
            </div>
          </div>

          {/* Age Range */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content flex items-center gap-2 text-lg font-semibold">
                <FaCat className="size-5" />
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
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                {`${t('age_range')}: ${searchFilters.minAgeWeeks} - ${searchFilters.maxAgeWeeks} ${t('weeks')} (${Math.round(searchFilters.minAgeWeeks / 4)} - ${Math.round(searchFilters.maxAgeWeeks / 4)} ${t('months')})`}
              </span>
            </label>
          </div>

          {/* Gender Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content text-lg font-semibold">
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
                className={`btn gap-2 ${searchFilters.gender === 'Male' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Male')}
              >
                <TbGenderMale className="size-5" />
                {t('male')}
              </button>
              <button
                className={`btn gap-2 ${searchFilters.gender === 'Female' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Female')}
              >
                <TbGenderFemale className="size-5" />
                {t('female')}
              </button>
            </div>
          </div>

          {/* Neutered Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content flex items-center gap-2 text-lg font-semibold">
                <FaNeuter className="size-5" />
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

        {/* Footer Actions */}
        <div className="border-base-200 mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={onReset}
              className="btn btn-ghost"
              disabled={isSearching}
            >
              {t('reset')}
            </button>
            <button
              onClick={handleCloseClick}
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
                <span className="loading loading-spinner" />
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
