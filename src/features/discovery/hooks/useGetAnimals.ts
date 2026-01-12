import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetAnimalsResponseSchema } from '../validators/getAnimalsResponseValidator';
import getAnimals from '../api/getAnimals';
import type { GetAnimalsRequest } from '../types/GetAnimalsRequest';

export default function (
  animalFilters: GetAnimalsRequest,
  page: number = 1,
  pageSize: number = 10
) {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['adoptable-animals', userId, animalFilters, page, pageSize],
    queryFn: async (): Promise<GetAnimalsResponseSchema> =>
      await getAnimals(
        animalFilters,
        accessToken!,
        refreshToken!,
        page,
        pageSize
      ),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
