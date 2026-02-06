import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth-store';
import getUserProfilePicture from '../api/getUserProfilePicture';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useQuery({
    queryKey: ['profile-picture', userId],
    queryFn: async (): Promise<string | null> =>
      await getUserProfilePicture(userId!, accessToken!, refreshToken!),
    enabled: !isLoadingSession && !!userId && !!accessToken && !!refreshToken
  });
}
