import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../stores/auth-store';
import useGetAnimalListings from '../hooks/useGetAnimalListings';
import RehomerDashboardSkeleton from './RehomerDashboardSkeleton';
import RehomerDashboardEmpty from './RehomerDashboardEmpty';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

export default function RehomerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const isAuthenticatedUserSession = useAuthStore(
    (state) => state.isAuthenticatedUserSession
  );

  const goToLoginPage = () => navigate('/login', { replace: true });

  const goToAddAnimalListingPage = () => navigate('/rehomer/animal/add');

  const goToEditAnimalListingPage = (animalId: string) =>
    navigate(`/rehomer/animal/edit/${animalId}`);

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
  } = useGetAnimalListings();

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
      {!isLoadingAnimalListings &&
      !getAnimalListingsFailed &&
      animalListings?.animals.length === 0 ? (
        <RehomerDashboardEmpty />
      ) : (
        <div className="mt-7">
          {isLoadingAnimalListings ? (
            <RehomerDashboardSkeleton />
          ) : (
            <>
              {`${animalListings?.animals.length} ${t('cats')}`}
              <ul className="list bg-base-100 rounded-box shadow-md">
                {animalListings?.animals.map((animal) => (
                  <li className="list-row" key={animal.animalId}>
                    <div>
                      <img
                        className="rounded-box size-24"
                        src={animal.animalPhotos[0].photoUrl}
                        alt={animal.name}
                      />
                    </div>
                    <div>
                      <div>{animal.name}</div>
                      <div className="text-xs font-semibold uppercase opacity-60">
                        {`${animal.gender} - ${(animal.ageInWeeks / 4).toFixed(1)} month(s) old - ${animal.addressDisplayName}`}
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
                    <button className="btn btn-square btn-ghost">
                      <FaRegTrashAlt className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
