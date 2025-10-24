import { axiosUsersClient } from '../../../utils/axios-client';
import { getUserProfilePictureResponseValidator } from '../validators/getUserProfilePictureResponseValidator';
import type { GetUserProfilePictureResponse } from '../types/GetUserProfilePictureResponse';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetUserProfilePictureResponse> {
  try {
    const userProfilePictureResponse = await axiosUsersClient.get(
      `/${userId}/profile-picture`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getUserProfilePictureResponseValidator.safeParse(
      userProfilePictureResponse.data
    );
    if (success && data) return { avatarUrl: data.avatarUrl };
    return Promise.reject(
      new Error(i18next.t('get_user_profile_picture_error'))
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('get_user_profile_picture_error'))
    );
  }
}
