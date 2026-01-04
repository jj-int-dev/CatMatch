import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import deleteAnimalListing from '../api/deleteAnimalListing';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (animalId: string): Promise<void> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      return await deleteAnimalListing(
        userId,
        animalId,
        accessToken,
        refreshToken
      );
    }
  });
}
