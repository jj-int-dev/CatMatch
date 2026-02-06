import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import useGetAnimalListings from '../hooks/useGetAnimalListings';
import RehomerDashboardSkeleton from './RehomerDashboardSkeleton';
import RehomerDashboardEmpty from './RehomerDashboardEmpty';
import RehomerDashboardError from './RehomerDashboardError';
import MobileAnimalCard from './MobileAnimalCard';
import ErrorToast from '../../../components/toasts/ErrorToast';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { DeleteAnimalDialog, type AnimalToDelete } from './DeleteAnimalDialog';
import useDeleteAnimalListing from '../hooks/useDeleteAnimalListing';
import defaultCatPic from '../../../assets/default_cat.webp';
import useGetUserType from '../../../hooks/useGetUserType';

export default function RehomerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const { data: userType, isLoading: isLoadingUserType } = useGetUserType();

  const goToDiscovery = () => navigate('/discovery', { replace: true });
  const goToLoginPage = () => navigate('/login', { replace: true });
  const goToAddAnimalListingPage = () => navigate('/rehomer/animal/add');
  const goToEditAnimalListingPage = (animalId: string) =>
    navigate(`/rehomer/animal/edit/${animalId}`);

  useEffect(() => {
    if (!isLoadingSession && !isLoadingUserType) {
      if (!isAuthenticatedUserSession(userSession)) {
        goToLoginPage();
        return;
      }
      if (userType === 'Adopter') {
        goToDiscovery();
      }
    }
  }, [userSession, isLoadingSession, isLoadingUserType, userType]);

  const getAgeDisplay = (ageInWeeks: number) =>
    `${(ageInWeeks / 4).toFixed(2)} ${t('months_old')}`;

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = !isNaN(pageFromUrl) && pageFromUrl >= 1 ? pageFromUrl : 1;
  const pageSize = 10;

  const [page, setPage] = useState(initialPage);

  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', newPage.toString());
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    data: animalListings,
    isPending: isLoadingAnimalListings,
    isError: getAnimalListingsFailed
  } = useGetAnimalListings(page, pageSize);

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

  const {
    mutateAsync: deleteAnimalListing,
    isError: deleteAnimalListingFailed
  } = useDeleteAnimalListing();

  const [animalToDelete, setAnimalToDelete] = useState<AnimalToDelete | null>(
    null
  );
  const [isDeletingAnimal, setIsDeletingAnimal] = useState(false);
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);

  const openDeletionDialog = (animal: AnimalToDelete) => {
    setAnimalToDelete(animal);
    setIsDeletingAnimal(false);
    setIsDeletionDialogOpen(true);
  };

  const closeDeletionDialog = () => {
    setIsDeletionDialogOpen(false);
    setAnimalToDelete(null);
  };

  const handleDeleteAnimal = async () => {
    if (!animalToDelete) return;

    setIsDeletingAnimal(true);
    await deleteAnimalListing(animalToDelete.animalId);
    setIsDeletingAnimal(false);
    closeDeletionDialog();
    queryClient.invalidateQueries({
      queryKey: ['animal-listings', userSession?.user.id, page, pageSize]
    });
  };

  const [showDeleteError, setShowDeleteError] = useState(false);

  useEffect(() => {
    if (deleteAnimalListingFailed) {
      setShowDeleteError(true);
    }
  }, [deleteAnimalListingFailed]);

  const handleCloseDeleteErrorToast = () => {
    setShowDeleteError(false);
  };

  if (getAnimalListingsFailed) {
    return (
      <div className="from-base-200 to-base-300 min-h-screen bg-gradient-to-br px-4 pt-28 pb-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-base-content mb-8 text-center text-4xl font-bold md:text-5xl">
            {t('rehomer_dashboard_title')}
          </h1>
          <RehomerDashboardError
            errorType="load"
            onRetry={() => {
              queryClient.invalidateQueries({
                queryKey: [
                  'animal-listings',
                  userSession?.user.id,
                  page,
                  pageSize
                ]
              });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="from-base-200 to-base-300 min-h-screen bg-gradient-to-br px-4 pt-28 pb-10 md:px-8">
      {showDeleteError && (
        <ErrorToast
          messages={[t('delete_animal_listing_error')]}
          onCloseToast={handleCloseDeleteErrorToast}
        />
      )}

      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-base-content text-center text-4xl font-bold md:text-left md:text-5xl">
            {t('rehomer_dashboard_title')}
          </h1>
          <button
            className="btn btn-success gap-2 shadow-lg"
            onClick={goToAddAnimalListingPage}
          >
            <IoAddCircleOutline className="h-5 w-5" />
            {t('add')}
          </button>
        </div>

        {/* Content Section */}
        {!isLoadingAnimalListings && animalListings?.animals.length === 0 ? (
          <RehomerDashboardEmpty />
        ) : (
          <div className="space-y-6">
            {isLoadingAnimalListings ? (
              <RehomerDashboardSkeleton />
            ) : (
              <>
                {/* Stats and Pagination */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                      {/* Results Info */}
                      <div className="text-base-content/70 text-center text-sm md:text-left md:text-base">
                        {t('showing')}{' '}
                        <span className="text-base-content font-semibold">
                          {animalListings?.pagination.totalResults === 0
                            ? 0
                            : (animalListings?.pagination.page! - 1) *
                                animalListings?.pagination.pageSize! +
                              1}
                        </span>
                        {' - '}
                        <span className="text-base-content font-semibold">
                          {Math.min(
                            animalListings?.pagination.page! *
                              animalListings?.pagination.pageSize!,
                            animalListings?.pagination.totalResults!
                          )}
                        </span>{' '}
                        {t('of')}{' '}
                        <span className="text-base-content font-semibold">
                          {animalListings?.pagination.totalResults}
                        </span>{' '}
                        {t('cats')}
                      </div>

                      {/* Pagination Controls */}
                      <div className="join shadow-md">
                        <button
                          className="btn btn-sm join-item md:btn-md"
                          onClick={goToPreviousPage}
                          disabled={page === 1 || isLoadingAnimalListings}
                        >
                          ‹
                        </button>
                        <button className="btn btn-sm join-item no-animation md:btn-md cursor-default">
                          {t('page')} {animalListings?.pagination.page} /{' '}
                          {animalListings?.pagination.totalPages}
                        </button>
                        <button
                          className="btn btn-sm join-item md:btn-md"
                          onClick={goToNextPage}
                          disabled={
                            page === animalListings?.pagination.totalPages ||
                            isLoadingAnimalListings
                          }
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animals List */}
                {isMobile ? (
                  <div className="space-y-4">
                    {animalListings?.animals.map((animal) => (
                      <MobileAnimalCard
                        key={animal.animalId}
                        animal={animal}
                        onEdit={goToEditAnimalListingPage}
                        onDelete={openDeletionDialog}
                        getAgeDisplay={getAgeDisplay}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body p-0">
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr className="border-base-300">
                              <th className="bg-base-200">{t('photo')}</th>
                              <th className="bg-base-200">{t('name')}</th>
                              <th className="bg-base-200">{t('details')}</th>
                              <th className="bg-base-200">
                                {t('description')}
                              </th>
                              <th className="bg-base-200 text-right">
                                {t('actions')}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {animalListings?.animals.map((animal) => (
                              <tr
                                key={animal.animalId}
                                className="hover border-base-300"
                              >
                                <td>
                                  <div className="avatar">
                                    <div className="mask mask-squircle h-16 w-16">
                                      <img
                                        src={
                                          animal.animalPhotos[0]?.photoUrl ||
                                          defaultCatPic
                                        }
                                        alt={animal.name}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content font-bold">
                                    {animal.name}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content/70 text-sm">
                                    {animal.gender} •{' '}
                                    {getAgeDisplay(animal.ageInWeeks)}
                                  </div>
                                  <div className="badge badge-ghost badge-sm mt-1">
                                    {animal.addressDisplayName}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-base-content/70 line-clamp-2 max-w-md text-sm">
                                    {animal.description}
                                  </div>
                                </td>
                                <td>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      className="btn btn-ghost btn-sm"
                                      onClick={() =>
                                        goToEditAnimalListingPage(
                                          animal.animalId
                                        )
                                      }
                                      aria-label={t('edit')}
                                    >
                                      <FaRegEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                      className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                      onClick={() =>
                                        openDeletionDialog({
                                          animalId: animal.animalId,
                                          name: animal.name,
                                          gender: animal.gender,
                                          ageDisplay: getAgeDisplay(
                                            animal.ageInWeeks
                                          ),
                                          addressDisplay:
                                            animal.addressDisplayName,
                                          description: animal.description,
                                          photoUrl:
                                            animal.animalPhotos.find(
                                              (a) => a.order === 0
                                            )?.photoUrl ?? ''
                                        })
                                      }
                                      aria-label={t('delete')}
                                    >
                                      <FaRegTrashAlt className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deletion Confirmation Dialog */}
                {animalToDelete && (
                  <DeleteAnimalDialog
                    animal={animalToDelete}
                    isOpen={isDeletionDialogOpen}
                    isDeleting={isDeletingAnimal}
                    onClose={closeDeletionDialog}
                    onConfirm={handleDeleteAnimal}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
