import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import {
  getUserProfileResponseValidator,
  type GetUserProfileResponseSchema
} from '../validators/getUserProfileResponseValidator';
import type { UserProfileFormSchema } from '../validators/userProfileFormValidator';

export default async function (
  userId: string,
  userProfileData: UserProfileFormSchema,
  accessToken: string,
  refreshToken: string
): Promise<GetUserProfileResponseSchema> {
  try {
    const userProfileResponse = await axiosUsersClient.patch(
      `/${userId}/profile`,
      userProfileData,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getUserProfileResponseValidator.safeParse(
      userProfileResponse.data
    );
    if (success && data) return data;
    return Promise.reject(new Error(i18next.t('update_user_profile_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('update_user_profile_error')));
  }
}
