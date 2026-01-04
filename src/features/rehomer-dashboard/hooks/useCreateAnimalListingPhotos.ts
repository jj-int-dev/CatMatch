import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import createAnimalListingPhotos from '../api/createAnimalListingPhotos';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (data: {
      animalId: string;
      animalPhotos: FormData;
    }): Promise<void> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      await createAnimalListingPhotos(
        userId,
        data.animalId,
        data.animalPhotos,
        accessToken,
        refreshToken
      );
    }
  });
}
