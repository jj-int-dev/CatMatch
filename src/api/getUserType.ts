import { axiosUsersClient } from '../utils/axios-client';
import getTokenHeaders from '../utils/getTokenHeaders';
import i18next from '../utils/i18n';
import { getUserTypeValidator } from '../validators/getUserTypeValidator';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<string | null> {
  try {
    const response = await axiosUsersClient.get(`/${userId}/type`, {
      headers: getTokenHeaders(accessToken, refreshToken)
    });
    const { success, data } = getUserTypeValidator.safeParse(response.data);

    if (success) return data.userType;

    return Promise.reject(new Error(i18next.t('get_user_info_error')));
  } catch (_error) {
    return Promise.reject(new Error(i18next.t('get_user_info_error')));
  }
}
