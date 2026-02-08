import { axiosUsersClient } from '../../../utils/axios-client';
import {
  getUserProfileResponseValidator,
  type GetUserProfileResponseSchema
} from '../validators/getUserProfileResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetUserProfileResponseSchema> {
  try {
    const userProfileResponse = await axiosUsersClient.get(
      `/${userId}/profile`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getUserProfileResponseValidator.safeParse(
      userProfileResponse.data
    );
    if (success && data) return data;
    return Promise.reject(new Error(i18next.t('get_user_profile_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_user_profile_error')));
  }
}
