import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetAnimalListingsResponseSchema } from '../validators/getAnimalListingsResponseValidator';
import getAnimalListings from '../api/getAnimalListings';

export default function (page: number = 1, pageSize: number = 10) {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['animal-listings', userId, page, pageSize],
    queryFn: async (): Promise<GetAnimalListingsResponseSchema> =>
      await getAnimalListings(
        userId!,
        accessToken!,
        refreshToken!,
        page,
        pageSize
      ),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
