import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetAnimalResponseSchema } from '../validators/getAnimalResponseValidator';
import getAnimal from '../api/getAnimal';

export default function (animalId: string) {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['adoptable-animal', userId, animalId],
    queryFn: async (): Promise<GetAnimalResponseSchema> =>
      await getAnimal(animalId!, accessToken!, refreshToken!),
    enabled:
      !isLoadingSession &&
      !!userId &&
      !!animalId &&
      !!accessToken &&
      !!refreshToken
  });
}
