import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import type { CreateAnimalListingResponseSchema } from '../validators/createAnimalListingResponseValidator';
import createAnimalListing from '../api/createAnimalListing';
import type { CreateAnimalListingRequest } from '../types/CreateAnimalListingRequest';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      animalData: CreateAnimalListingRequest
    ): Promise<CreateAnimalListingResponseSchema> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      return await createAnimalListing(
        userId,
        animalData,
        accessToken,
        refreshToken
      );
    }
  });
}
