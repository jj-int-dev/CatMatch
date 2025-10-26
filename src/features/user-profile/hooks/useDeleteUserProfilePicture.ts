import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import deleteUserProfilePicture from '../api/deleteUserProfilePicture';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (): Promise<void> =>
      await deleteUserProfilePicture(userId!, accessToken!, refreshToken!)
  });
}
