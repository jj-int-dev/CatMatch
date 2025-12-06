import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetAnimalListingResponseSchema } from '../validators/getAnimalListingResponseValidator';
import getAnimalListing from '../api/getAnimalListing';

export default function (animalId: string) {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['animal-listing', userId, animalId],
    queryFn: async (): Promise<GetAnimalListingResponseSchema> =>
      await getAnimalListing(userId!, animalId!, accessToken!, refreshToken!),
    enabled:
      !isLoadingSession &&
      !!userId &&
      !!animalId &&
      !!accessToken &&
      !!refreshToken
  });
}
