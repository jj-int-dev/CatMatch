import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetUserProfilePictureResponse } from '../types/GetUserProfilePictureResponse';
import getUserProfilePicture from '../api/getUserProfilePicture';

export default function () {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['user-profile-picture', userId],
    queryFn: async (): Promise<GetUserProfilePictureResponse> =>
      await getUserProfilePicture(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
