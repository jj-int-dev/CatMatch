import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    await axiosUsersClient.delete(`/${userId}`, {
      headers: getTokenHeaders(accessToken, refreshToken)
    });
  } catch (error) {
    return Promise.reject(new Error(i18next.t('delete_user_error')));
  }
}
