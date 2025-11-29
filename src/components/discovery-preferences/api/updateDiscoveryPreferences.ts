import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import type { DiscoveryPreferencesSchema } from '../validators/discoveryPreferencesValidator';

export default async function (
  userId: string,
  discoveryPreferences: DiscoveryPreferencesSchema,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    await axiosUsersClient.put(
      `/${userId}/discovery-preferences`,
      discoveryPreferences,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('update_discovery_preferences_error'))
    );
  }
}
