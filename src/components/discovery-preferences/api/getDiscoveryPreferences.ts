import { axiosUsersClient } from '../../../utils/axios-client';
import {
  getDiscoveryPreferencesResponseValidator,
  type GetDiscoveryPreferencesResponseSchema
} from '../validators/getDiscoveryPreferencesResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetDiscoveryPreferencesResponseSchema> {
  try {
    const discoveryPrefsResponse = await axiosUsersClient.get(
      `/${userId}/discovery-preferences`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } =
      getDiscoveryPreferencesResponseValidator.safeParse(
        discoveryPrefsResponse.data
      );
    if (success) return { discoveryPreferences: data.discoveryPreferences };
    return Promise.reject(
      new Error(i18next.t('get_discovery_preferences_error'))
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('get_discovery_preferences_error'))
    );
  }
}
