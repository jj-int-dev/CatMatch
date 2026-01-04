import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import updateAnimalListing from '../api/updateAnimalListing';
import type { UpdateAnimalListingRequest } from '../types/UpdateAnimalListingRequest';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (data: {
      animalId: string;
      animalData: UpdateAnimalListingRequest;
    }): Promise<void> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      await updateAnimalListing(
        userId,
        data.animalId,
        data.animalData,
        accessToken,
        refreshToken
      );
    }
  });
}
