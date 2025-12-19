import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import updateDiscoveryPreferences from '../api/updateDiscoveryPreferences';
import type { UpdateDiscoveryPreferencesRequestBody } from '../types/UpdateDiscoveryPreferencesRequestBody';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (
      discoveryPreferences: UpdateDiscoveryPreferencesRequestBody
    ): Promise<void> =>
      await updateDiscoveryPreferences(
        userId!,
        discoveryPreferences,
        accessToken!,
        refreshToken!
      )
  });
}
