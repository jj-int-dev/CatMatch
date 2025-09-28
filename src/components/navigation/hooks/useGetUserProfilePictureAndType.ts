import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import getUserProfilePictureAndType from '../api/getUserProfilePictureAndType';
import type { GetUserProfilePictureAndTypeResponse } from '../types/GetUserProfilePictureAndTypeResponse';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['navigation', userId],
    queryFn: async (): Promise<GetUserProfilePictureAndTypeResponse> =>
      await getUserProfilePictureAndType(userId!, accessToken!, refreshToken!),
    enabled: !!userId && !!accessToken && !!refreshToken
  });
}
