import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import { useTranslation } from 'react-i18next';
import ErrorToast from '../../../components/toasts/ErrorToast';
import SearchPopover from './SearchPopover';
import type { SearchFilters } from '../types/SearchFilters';
import type { GetAnimalsRequest } from '../types/GetAnimalsRequest';
import useGetAnimals from '../hooks/useGetAnimals';
import { IoSearch } from 'react-icons/io5';
import { TbGenderMale, TbGenderFemale } from 'react-icons/tb';
import defaultCatPic from '../../../assets/default_cat.webp';
// import {
//   createGetAnimalsRequestFromFormData,
//   getAddAnimalFormErrorMessages
// } from '../utils/formSubmission';

export function Discovery() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToAnimalDetails = (animalId: string) =>
    navigate(`/discovery/animal/${animalId}`);

  // Get page from URL query parameter or default to 1
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = !isNaN(pageFromUrl) && pageFromUrl >= 1 ? pageFromUrl : 1;
  const pageSize = 10;

  // Pagination state
  const [page, setPage] = useState(initialPage);

  // Update URL when page changes
  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', newPage.toString());
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    if (!isLoadingSession) {
      // Only check authentication after session loading is complete
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
      }
    }
  }, [userSession, isLoadingSession]);

  const defaultSearchFilters: SearchFilters = {
    gender: 'All',
    minAgeWeeks: 0,
    maxAgeWeeks: 1920,
    neutered: 'All',
    maxDistanceMeters: 250000,
    location: {
      formatted: null,
      latitude: null,
      longitude: null
    }
  };

  const defaultSearchRequest: GetAnimalsRequest = {
    gender: 'All',
    minAgeWeeks: 0,
    maxAgeWeeks: 1920,
    neutered: false,
    locationSource: 'client-ip',
    maxDistanceMeters: 250000
  };

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    ...defaultSearchFilters
  });
  const [locationSource, setLocationSource] = useState<string>('client-ip');
  const [locationDetails, setLocationDetails] = useState<string | null>(null);
  const [searchRequest, setSearchRequest] = useState<GetAnimalsRequest>({
    ...defaultSearchRequest
  });
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);

  const {
    data: animalsData,
    isPending: isGettingAnimals,
    isError: getAnimalsFailed,
    error: getAnimalsError
  } = useGetAnimals(searchRequest, page, pageSize);

  // Handle page navigation
  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      updatePage(page - 1);
    }
  }, [page, updatePage]);

  const goToNextPage = useCallback(() => {
    if (
      animalsData?.pagination.totalPages &&
      page < animalsData.pagination.totalPages
    ) {
      updatePage(page + 1);
    }
  }, [page, updatePage, animalsData?.pagination.totalPages]);

  const handleReset = () => {
    setSearchFilters({ ...defaultSearchFilters });
    setSearchRequest({ ...defaultSearchRequest });
    updatePage(1);
  };

  const handleSearch = async () => {};

  const getAgeDisplay = (ageInWeeks: number) => {
    // Weeks
    if (ageInWeeks < 4) {
      return `${ageInWeeks} ${t('week')}${ageInWeeks === 1 ? '' : t('weeks_plural_suffix')}`;
    }

    // Convert weeks → months (rounded)
    const months = Math.round(ageInWeeks / 4);

    // Months only
    if (months < 12) {
      return `${months} ${t('month')}${months === 1 ? '' : t('months_plural_suffix')}`;
    }

    // Years + months
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} ${t('year')}${years === 1 ? '' : t('years_plural_suffix')}`;
    }

    return `${years} ${t('year')}${years === 1 ? '' : t('years_plural_suffix')} ${remainingMonths} ${t('month')}${
      remainingMonths === 1 ? '' : t('months_plural_suffix')
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8">
      // TODO: Add loading state while fetching animals
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-gray-800 md:text-5xl">
            {t('discovery_title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {locationSource === 'client-ip'
              ? `${t('discovery_ip')} ${animalsData?.locationDisplay} ${t('discovery_ip_1')}`
              : locationSource === 'client-custom-location'
                ? `${t('discovery_custom_location')} ${animalsData?.locationDisplay}`
                : `${t('discovery_current_location')}`}
          </p>
        </div>

        {/* Search Bar and Controls */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsSearchPopoverOpen(true)}
              className="btn btn-primary w-full gap-2 pr-6 pl-4 text-lg md:w-auto"
            >
              <IoSearch className="size-6" />
              <span>{t('discovery_search_btn')}</span>
            </button>

            {/* Search Popover Component */}
            <SearchPopover
              isOpen={isSearchPopoverOpen}
              isSearching={isGettingAnimals}
              searchFilters={searchFilters}
              onClose={() => setIsSearchPopoverOpen(false)}
              onSearch={handleSearch}
              onReset={handleReset}
              onFiltersChange={setSearchFilters}
            />
          </div>

          {/* Results Summary */}
          <div className="text-center md:text-right">
            <p className="text-lg font-semibold text-gray-800">
              {animalsData?.animals.length} {t('animals_found')}
            </p>
            <p className="text-sm text-gray-600">
              {t('page')} {page} {t('of')} {animalsData?.pagination.totalPages}
            </p>
          </div>
        </div>

        {/* Cats Grid */}
        {animalsData?.animals.length === 0 ? (
          <div className="rounded-box bg-base-100 border p-12 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-700">
              {t('no_animals_found')}
            </h3>
            <p className="mt-2 text-gray-600">{t('discovery_search_help')}</p>
            <button
              onClick={() => setIsSearchPopoverOpen(true)}
              className="btn btn-primary mt-6"
            >
              {t('modify_search')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {animalsData?.animals.map((animal) => (
                <div
                  key={animal.animalId}
                  className="card card-compact rounded-box bg-base-100 overflow-hidden border shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={
                        animal.animalPhotos.length > 0
                          ? animal.animalPhotos[0].photoUrl
                          : defaultCatPic
                      }
                      alt={animal.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title text-xl font-bold">
                          {animal.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`badge ${animal.gender === 'Male' ? 'badge-info' : 'badge-secondary'}`}
                          >
                            {animal.gender === 'Male' ? (
                              <TbGenderMale className="mr-1 inline size-4" />
                            ) : (
                              <TbGenderFemale className="mr-1 inline size-4" />
                            )}
                            {animal.gender}
                          </span>
                          <span className="badge badge-outline">
                            {getAgeDisplay(animal.ageInWeeks)}
                          </span>
                          <span
                            className={`badge ${animal.neutered ? 'badge-success' : 'badge-warning'}`}
                          >
                            {t(animal.neutered ? 'neutered' : 'not_neutered')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary text-2xl font-bold">
                          {(animal.distanceMeters / 1000).toFixed(1)} km
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {animal.description}
                    </p>

                    <div className="card-actions mt-4">
                      <button className="btn btn-primary btn-block group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                        <span className="relative z-10">
                          {t('view_details')}
                        </span>
                        <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0"></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {animalsData && animalsData.pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={goToPreviousPage}
                    disabled={page === 1}
                  >
                    «
                  </button>
                  {Array.from(
                    { length: animalsData.pagination.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`join-item btn ${pageNum === page ? 'btn-active' : ''}`}
                      onClick={() => updatePage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    className="join-item btn"
                    onClick={goToNextPage}
                    disabled={page === animalsData.pagination.totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
