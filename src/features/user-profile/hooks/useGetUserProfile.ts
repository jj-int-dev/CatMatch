import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import getUserProfile from '../api/getUserProfile';
import type { GetUserProfileResponseSchema } from '../validators/getUserProfileResponseValidator';

export default function () {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<GetUserProfileResponseSchema> =>
      await getUserProfile(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
