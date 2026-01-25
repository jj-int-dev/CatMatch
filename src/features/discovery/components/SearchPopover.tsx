import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { IoClose, IoLocationOutline } from 'react-icons/io5';
import { FaCat, FaNeuter } from 'react-icons/fa';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import { GiPathDistance } from 'react-icons/gi';
import type { SearchFilters } from '../types/SearchFilters';

type SearchPopoverProps = {
  isOpen: boolean;
  isSearching: boolean;
  searchFilters: SearchFilters;
  locationSource:
    | 'client-ip'
    | 'client-current-location'
    | 'client-custom-location';
  setLocationSource: (
    source: 'client-ip' | 'client-current-location' | 'client-custom-location'
  ) => void;
  onClose: () => void;
  onSearch: () => Promise<void>;
  onReset: () => void;
  onFiltersChange: (newFilters: SearchFilters) => void;
};

export default function SearchPopover({
  isOpen,
  isSearching,
  searchFilters,
  locationSource,
  setLocationSource,
  onClose,
  onSearch,
  onReset,
  onFiltersChange
}: SearchPopoverProps) {
  const { t } = useTranslation();

  const popoverRef = useRef<HTMLDialogElement>(null);

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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  checked={searchCriteria.useCurrentLocation}
                  onChange={(e) =>
                    handleFieldChange('useCurrentLocation', e.target.checked)
                  }
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
                ref={addressInputRef}
                type="text"
                placeholder={t(
                  locationSource === 'client-current-location'
                    ? 'using_current_location'
                    : 'address_placeholder'
                )}
                className="input input-bordered w-full"
                value={searchCriteria.location}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => {
                  if (searchCriteria.location.length > 2) {
                    setShowAddressSuggestions(true);
                  }
                }}
                disabled={searchCriteria.useCurrentLocation}
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
                      {address}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {t('search_location_desc')}
            </p>
          </div>

          {/* Max Distance Field */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <GiPathDistance className="mr-2 inline size-5" />
                {t('max_distance')}:{' '}
                {Math.trunc(searchFilters.maxDistanceMeters / 1000)} km
              </span>
            </label>
            <input
              type="range"
              min="1000"
              max="250000"
              value={searchFilters.maxDistanceMeters}
              onChange={(e) =>
                handleFieldChange('maxDistance', parseInt(e.target.value))
              }
              className="range range-primary w-full"
            />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Age Range Fields */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <FaCat className="mr-2 inline size-5" />
                Age Range (weeks)
              </span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">
                  <span className="label-text">Minimum Age</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1920"
                  value={searchCriteria.minAge}
                  onChange={(e) =>
                    handleFieldChange(
                      'minAge',
                      Math.min(parseInt(e.target.value) || 0, 1920)
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Maximum Age</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1920"
                  value={searchCriteria.maxAge}
                  onChange={(e) =>
                    handleFieldChange(
                      'maxAge',
                      Math.min(parseInt(e.target.value) || 1920, 1920)
                    )
                  }
                  className="input input-bordered w-full"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Age range: {searchCriteria.minAge} - {searchCriteria.maxAge} weeks
              ({Math.round(searchCriteria.minAge / 4.33)} -{' '}
              {Math.round(searchCriteria.maxAge / 4.33)} months)
            </p>
          </div>

          {/* Gender Field */}
          <div className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">Gender</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn ${searchCriteria.gender === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'All')}
              >
                All Genders
              </button>
              <button
                className={`btn ${searchCriteria.gender === 'Male' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Male')}
              >
                <TbGenderMale className="mr-2 size-5" />
                Male
              </button>
              <button
                className={`btn ${searchCriteria.gender === 'Female' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('gender', 'Female')}
              >
                <TbGenderFemale className="mr-2 size-5" />
                Female
              </button>
            </div>
          </div>

          {/* Neutered Field */}
          <div className="mb-8">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                <FaNeuter className="mr-2 inline size-5" />
                Neutered Status
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`btn ${searchCriteria.neutered === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('neutered', 'All')}
              >
                All
              </button>
              <button
                className={`btn ${searchCriteria.neutered === 'Neutered Only' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('neutered', 'Neutered Only')}
              >
                Neutered Only
              </button>
              <button
                className={`btn ${searchCriteria.neutered === 'Not Neutered' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleFieldChange('neutered', 'Not Neutered')}
              >
                Not Neutered
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
              Reset
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isSearching}
            >
              Cancel
            </button>
          </div>
          <button
            onClick={onSearch}
            className="btn btn-primary gap-2"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <span className="loading loading-spinner"></span>
                Searching...
              </>
            ) : (
              <>Search Cats</>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
