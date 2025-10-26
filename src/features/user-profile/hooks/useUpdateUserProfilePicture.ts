import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { UpdateUserProfilePictureResponse } from '../types/UpdateUserProfilePictureResponse';
import updateUserProfilePicture from '../api/updateUserProfilePicture';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      imageFormData: FormData
    ): Promise<UpdateUserProfilePictureResponse> =>
      await updateUserProfilePicture(
        userId!,
        imageFormData,
        accessToken!,
        refreshToken!
      )
  });
}
