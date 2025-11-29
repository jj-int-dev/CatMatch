import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import { useDiscoveryPreferencesStore } from '../stores/discovery-preferences-store';
import type { GetDiscoveryPreferencesResponseSchema } from '../validators/getDiscoveryPreferencesResponseValidator';
import getDiscoveryPreferences from '../api/getDiscoveryPreferences';

export default function () {
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  const showDiscoveryPreferencesDialog = useDiscoveryPreferencesStore(
    (state) => state.showDiscoveryPreferencesDialog
  );

  return useQuery({
    queryKey: ['discovery-preferences', userId],
    queryFn: async (): Promise<GetDiscoveryPreferencesResponseSchema> =>
      await getDiscoveryPreferences(userId!, accessToken!, refreshToken!),
    enabled:
      !isLoadingSession &&
      !!userId &&
      !!accessToken &&
      !!refreshToken &&
      showDiscoveryPreferencesDialog
  });
}
