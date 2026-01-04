import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import useGetAnimalListings from '../hooks/useGetAnimalListings';
import RehomerDashboardSkeleton from './RehomerDashboardSkeleton';
import RehomerDashboardEmpty from './RehomerDashboardEmpty';
import RehomerDashboardError from './RehomerDashboardError';
import ErrorToast from '../../../components/toasts/ErrorToast';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { DeleteAnimalDialog, type AnimalToDelete } from './DeleteAnimalDialog';
import useDeleteAnimalListing from '../hooks/useDeleteAnimalListing';
import defaultCatPic from '../../../assets/default_cat.webp';

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

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToAddAnimalListingPage = () => navigate('/rehomer/animal/add');

  const goToEditAnimalListingPage = (animalId: string) =>
    navigate(`/rehomer/animal/edit/${animalId}`);

  const getAgeDisplay = (ageInWeeks: number) =>
    `${(ageInWeeks / 4).toFixed(1)} month(s) old`;

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

  const {
    data: animalListings,
    isPending: isLoadingAnimalListings,
    isError: getAnimalListingsFailed
  } = useGetAnimalListings(page, pageSize);

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

  const {
    mutateAsync: deleteAnimalListing,
    isError: deleteAnimalListingFailed
  } = useDeleteAnimalListing();

  // State for deletion confirmation dialog
  const [animalToDelete, setAnimalToDelete] = useState<AnimalToDelete | null>(
    null
  );
  const [isDeletingAnimal, setIsDeletingAnimal] = useState(false);
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);

  // Functions for delete dialog
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

  // Handle error states
  if (getAnimalListingsFailed) {
    return (
      <div className="-mt-16 flex w-screen flex-col justify-start bg-[#f9f9f9] bg-cover bg-center px-8 pt-28 pb-10">
        <h1 className="self-center font-serif text-5xl font-bold">
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
    );
  }

  // Show error toast for delete failures
  const [showDeleteError, setShowDeleteError] = useState(false);

  useEffect(() => {
    if (deleteAnimalListingFailed) {
      setShowDeleteError(true);
    }
  }, [deleteAnimalListingFailed]);

  const handleCloseDeleteErrorToast = () => {
    setShowDeleteError(false);
  };

  return (
    <div className="-mt-16 flex w-screen flex-col justify-start bg-[#f9f9f9] bg-cover bg-center px-8 pt-28 pb-10">
      <h1 className="self-center font-serif text-5xl font-bold">
        {t('rehomer_dashboard_title')}
      </h1>
      <button
        className="btn btn-soft btn-success mt-16 self-end pl-2"
        onClick={goToAddAnimalListingPage}
      >
        <IoAddCircleOutline className="size-5" />{' '}
        <span className="text-base">{t('add')}</span>
      </button>
      {!isLoadingAnimalListings && animalListings?.animals.length === 0 ? (
        <RehomerDashboardEmpty />
      ) : (
        <div className="mt-7">
          {isLoadingAnimalListings ? (
            <RehomerDashboardSkeleton />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  {t('showing')}{' '}
                  {animalListings?.pagination.totalResults === 0
                    ? 0
                    : (animalListings?.pagination.page! - 1) *
                        animalListings?.pagination.pageSize! +
                      1}{' '}
                  -{' '}
                  {Math.min(
                    animalListings?.pagination.page! *
                      animalListings?.pagination.pageSize!,
                    animalListings?.pagination.totalResults!
                  )}{' '}
                  {t('of')} {animalListings?.pagination.totalResults}{' '}
                  {t('cats')}
                </div>
                <div className="join">
                  <button
                    className="btn join-item"
                    onClick={goToPreviousPage}
                    disabled={page === 1 || isLoadingAnimalListings}
                  >
                    {t('previous')}
                  </button>
                  <button className="btn join-item no-animation cursor-default">
                    {t('page')} {animalListings?.pagination.page} /{' '}
                    {animalListings?.pagination.totalPages}
                  </button>
                  <button
                    className="btn join-item"
                    onClick={goToNextPage}
                    disabled={
                      page === animalListings?.pagination.totalPages ||
                      isLoadingAnimalListings
                    }
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
              <ul className="list bg-base-100 rounded-box shadow-md">
                {animalListings?.animals.map((animal) => (
                  <li className="list-row" key={animal.animalId}>
                    <div>
                      <img
                        className="rounded-box size-24"
                        src={animal.animalPhotos[0]?.photoUrl || defaultCatPic}
                        alt={animal.name}
                      />
                    </div>
                    <div>
                      <div>{animal.name}</div>
                      <div className="text-xs font-semibold uppercase opacity-60">
                        {`${animal.gender} - ${getAgeDisplay(animal.ageInWeeks)} - ${animal.addressDisplayName}`}
                      </div>
                      <p className="list-col-wrap text-xs">
                        {animal.description}
                      </p>
                    </div>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => goToEditAnimalListingPage(animal.animalId)}
                    >
                      <FaRegEdit className="size-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() =>
                        openDeletionDialog({
                          animalId: animal.animalId,
                          name: animal.name,
                          gender: animal.gender,
                          ageDisplay: getAgeDisplay(animal.ageInWeeks),
                          addressDisplay: animal.addressDisplayName,
                          description: animal.description,
                          photoUrl:
                            animal.animalPhotos.find((a) => a.order === 0)
                              ?.photoUrl ?? ''
                        })
                      }
                    >
                      <FaRegTrashAlt className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>

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

      {/* Error toast for delete failures */}
      {showDeleteError && (
        <ErrorToast
          messages={[t('delete_animal_listing_error')]}
          onCloseToast={handleCloseDeleteErrorToast}
        />
      )}
    </div>
  );
}
