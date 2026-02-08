import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import i18next from '../../../utils/i18n';
import updateUserProfile from '../api/updateUserProfile';
import type { UserProfileFormSchema } from '../validators/userProfileFormValidator';
import type { GetUserProfileResponseSchema } from '../validators/getUserProfileResponseValidator';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      userProfileData: UserProfileFormSchema
    ): Promise<GetUserProfileResponseSchema> => {
      if (!userId || !accessToken || !refreshToken) {
        throw new Error(i18next.t('auth_required'));
      }
      return await updateUserProfile(
        userId,
        userProfileData,
        accessToken,
        refreshToken
      );
    }
  });
}
