import { axiosUsersClient } from '../../../utils/axios-client';
import { getUserProfileResponseValidator } from '../validators/getUserProfileResponseValidator';
import type { GetUserProfileResponse } from '../types/GetUserProfileResponse';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetUserProfileResponse> {
  try {
    const userProfileResponse = await axiosUsersClient.get(
      `/${userId}/profile`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getUserProfileResponseValidator.safeParse(
      userProfileResponse.data
    );
    if (success && data) return { userProfile: data };
    throw new Error();
  } catch (error) {
    return { error: i18next.t('get_user_profile_error') };
  }
}
