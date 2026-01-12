import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import { useTranslation } from 'react-i18next';
import ErrorToast from '../../../components/toasts/ErrorToast';
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

  // Handle page navigation
  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      updatePage(page - 1);
    }
  }, [page, updatePage]);

  const goToNextPage = useCallback(() => {
    if (
      animalListings?.pagination.totalPages &&
      page < animalListings.pagination.totalPages
    ) {
      updatePage(page + 1);
    }
  }, [page, updatePage, animalListings?.pagination.totalPages]);

  const handleReset = async () => {};

  const handleSearch = async () => {};

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-gray-800 md:text-5xl">
            {t('discovery_title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t('discovery_subtitle')}
          </p>
        </div>

        {/* Search Bar and Controls */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsPopoverOpen(true)}
              className="btn btn-primary w-full gap-2 pr-6 pl-4 text-lg md:w-auto"
            >
              <IoSearch className="size-6" />
              <span>{t('discovery_search_btn')}</span>
            </button>

            {/* Search Popover Component */}
            <SearchPopover
              isOpen={isPopoverOpen}
              isSearching={isSearching}
              searchCriteria={searchCriteria}
              onClose={() => setIsPopoverOpen(false)}
              onSearch={handleSearch}
              onReset={handleReset}
              onCriteriaChange={setSearchCriteria}
            />
          </div>

          {/* Results Summary */}
          <div className="text-center md:text-right">
            <p className="text-lg font-semibold text-gray-800">
              {filteredCats.length} {t('animals_found')}
            </p>
            <p className="text-sm text-gray-600">
              {t('page')} {currentPage} {t('of')} {totalPages}
            </p>
          </div>
        </div>

        {/* Cats Grid */}
        {filteredCats.length === 0 ? (
          <div className="rounded-box bg-base-100 border p-12 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-700">
              {t('no_animals_found')}
            </h3>
            <p className="mt-2 text-gray-600">{t('discovery_search_help')}</p>
            <button
              onClick={() => setIsPopoverOpen(true)}
              className="btn btn-primary mt-6"
            >
              {t('modify_search')}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentCats.map((cat) => (
                <div
                  key={cat.id}
                  className="card card-compact rounded-box bg-base-100 overflow-hidden border shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title text-xl font-bold">
                          {cat.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`badge ${cat.gender === 'Male' ? 'badge-info' : 'badge-secondary'}`}
                          >
                            {cat.gender === 'Male' ? (
                              <TbGenderMale className="mr-1 inline size-4" />
                            ) : (
                              <TbGenderFemale className="mr-1 inline size-4" />
                            )}
                            {cat.gender}
                          </span>
                          <span className="badge badge-outline">
                            {cat.ageDisplay}
                          </span>
                          <span
                            className={`badge ${cat.neutered ? 'badge-success' : 'badge-warning'}`}
                          >
                            {t(cat.neutered ? 'neutered' : 'not_neutered')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-primary text-2xl font-bold">
                          {cat.distance} km
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-gray-600">
                      {cat.description}
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
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="join-item btn"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
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
