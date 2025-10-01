import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import type { GetUserProfileResponse } from '../types/GetUserProfileResponse';
import getUserProfile from '../api/getUserProfile';

export default function () {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<GetUserProfileResponse> =>
      await getUserProfile(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
