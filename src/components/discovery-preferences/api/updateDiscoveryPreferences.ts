import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import type { UpdateDiscoveryPreferencesRequestBody } from '../types/UpdateDiscoveryPreferencesRequestBody';

export default async function (
  userId: string,
  discoveryPreferences: UpdateDiscoveryPreferencesRequestBody,
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
