import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import getUserType from '../api/getUserType';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['userType', userId],
    queryFn: async (): Promise<string | null> =>
      await getUserType(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
