import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose, IoSearch, IoLocation } from 'react-icons/io5';
import type { SearchFilters } from '../types/SearchFilters';

interface MobileFilterModalProps {
  isOpen: boolean;
  isSearching: boolean;
  searchFilters: SearchFilters;
  onClose: () => void;
  onSearch: () => void;
  onReset: () => void;
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function MobileFilterModal({
  isOpen,
  isSearching,
  searchFilters,
  onClose,
  onSearch,
  onReset,
  onFiltersChange
}: MobileFilterModalProps) {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] =
    useState<SearchFilters>(searchFilters);

  if (!isOpen) return null;

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleLocationChange = (
    key: keyof SearchFilters['location'],
    value: any
  ) => {
    const newFilters = {
      ...localFilters,
      location: { ...localFilters.location, [key]: value }
    };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onSearch();
  };

  const handleResetAll = () => {
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex h-full items-end justify-center sm:items-center">
        <div className="card bg-base-100 w-full max-w-2xl shadow-2xl sm:rounded-3xl">
          {/* Header */}
          <div className="border-base-200 sticky top-0 z-10 flex items-center justify-between border-b p-6">
            <h2 className="text-base-content text-2xl font-bold">
              {t('discovery_search_btn')}
            </h2>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <IoClose className="size-6" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Gender Filter */}
              <div>
                <h3 className="text-base-content mb-4 text-lg font-semibold">
                  {t('gender')}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {['All', 'Male', 'Female'].map((gender) => (
                    <button
                      key={gender}
                      className={`btn ${
                        localFilters.gender === gender
                          ? 'btn-primary'
                          : 'btn-outline'
                      }`}
                      onClick={() => handleFilterChange('gender', gender)}
                    >
                      {t(gender.toLowerCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Filter */}
              <div>
                <h3 className="text-base-content mb-4 text-lg font-semibold">
                  {t('age')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        {t('min_age')} ({t('weeks')})
                      </span>
                      <span className="label-text-alt">
                        {Math.floor(localFilters.minAgeWeeks / 4.33)}{' '}
                        {t('months')}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1920"
                      value={localFilters.minAgeWeeks}
                      onChange={(e) =>
                        handleFilterChange(
                          'minAgeWeeks',
                          parseInt(e.target.value)
                        )
                      }
                      className="range range-primary"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">
                        {t('max_age')} ({t('weeks')})
                      </span>
                      <span className="label-text-alt">
                        {Math.floor(localFilters.maxAgeWeeks / 4.33)}{' '}
                        {t('months')}
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1920"
                      value={localFilters.maxAgeWeeks}
                      onChange={(e) =>
                        handleFilterChange(
                          'maxAgeWeeks',
                          parseInt(e.target.value)
                        )
                      }
                      className="range range-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Neutered Filter */}
              <div>
                <h3 className="text-base-content mb-4 text-lg font-semibold">
                  {t('neutered')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['All', 'Neutered Only'].map((option) => (
                    <button
                      key={option}
                      className={`btn ${
                        localFilters.neutered === option
                          ? 'btn-primary'
                          : 'btn-outline'
                      }`}
                      onClick={() => handleFilterChange('neutered', option)}
                    >
                      {t(option.toLowerCase().replace(' ', '_'))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div>
                <h3 className="text-base-content mb-4 text-lg font-semibold">
                  {t('max_distance')}
                </h3>
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      {t('distance')}
                    </span>
                    <span className="label-text-alt">
                      {Math.floor(localFilters.maxDistanceMeters / 1000)} km
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="250000"
                    step="10000"
                    value={localFilters.maxDistanceMeters}
                    onChange={(e) =>
                      handleFilterChange(
                        'maxDistanceMeters',
                        parseInt(e.target.value)
                      )
                    }
                    className="range range-primary"
                  />
                </div>
              </div>

              {/* Location Source */}
              <div>
                <h3 className="text-base-content mb-4 text-lg font-semibold">
                  {t('location_source')}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {['client-ip', 'client-custom-location'].map((source) => (
                    <button
                      key={source}
                      className={`btn gap-2 ${
                        localFilters.locationSource === source
                          ? 'btn-primary'
                          : 'btn-outline'
                      }`}
                      onClick={() =>
                        handleFilterChange('locationSource', source)
                      }
                    >
                      {source === 'client-ip' ? (
                        <>
                          <IoLocation className="size-5" />
                          {t('my_location')}
                        </>
                      ) : (
                        <>
                          <IoSearch className="size-5" />
                          {t('custom_location')}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Location Input */}
              {localFilters.locationSource === 'client-custom-location' && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      {t('enter_location')}
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder={t('location_placeholder')}
                    value={localFilters.location.formatted}
                    onChange={(e) =>
                      handleLocationChange('formatted', e.target.value)
                    }
                    className="input input-bordered w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-base-200 bg-base-100 sticky bottom-0 border-t p-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleResetAll}
                className="btn btn-outline"
                disabled={isSearching}
              >
                {t('reset')}
              </button>
              <button
                onClick={handleApply}
                className="btn btn-primary gap-2"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    {t('searching')}
                  </>
                ) : (
                  <>
                    <IoSearch className="size-5" />
                    {t('search')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
