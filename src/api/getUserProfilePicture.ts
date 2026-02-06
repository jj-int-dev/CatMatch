import { axiosUsersClient } from '../utils/axios-client';
import getTokenHeaders from '../utils/getTokenHeaders';
import i18next from '../utils/i18n';
import { getUserProfilePictureValidator } from '../validators/getUserProfilePictureValidator';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<string | null> {
  try {
    const response = await axiosUsersClient.get(`/${userId}/profile-picture`, {
      headers: getTokenHeaders(accessToken, refreshToken)
    });
    const { success, data } = getUserProfilePictureValidator.safeParse(
      response.data
    );

    if (success) return data.avatarUrl;

    return Promise.reject(new Error(i18next.t('get_user_info_error')));
  } catch (_error) {
    return Promise.reject(new Error(i18next.t('get_user_info_error')));
  }
}
