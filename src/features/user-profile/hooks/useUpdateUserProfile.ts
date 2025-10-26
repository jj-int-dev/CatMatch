import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { UpdateUserProfileResponse } from '../types/UpdateUserProfileResponse';
import updateUserProfile from '../api/updateUserProfile';
import type { UserProfileFormSchema } from '../validators/userProfileFormValidator';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      userProfileData: UserProfileFormSchema
    ): Promise<UpdateUserProfileResponse> =>
      await updateUserProfile(
        userId!,
        userProfileData,
        accessToken!,
        refreshToken!
      )
  });
}
