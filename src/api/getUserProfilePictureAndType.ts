import { axiosUsersClient } from '../utils/axios-client';
import { getUserProfilePictureAndTypeResponseValidator } from '../validators/getUserProfilePictureAndTypeResponseValidator';
import type { GetUserProfilePictureAndTypeResponse } from '../types/GetUserProfilePictureAndTypeResponse';
import getTokenHeaders from '../utils/getTokenHeaders';
import i18next from '../utils/i18n';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetUserProfilePictureAndTypeResponse> {
  try {
    const response = await axiosUsersClient.get(`/${userId}/profile-and-type`, {
      headers: getTokenHeaders(accessToken, refreshToken)
    });
    const { success, data } =
      getUserProfilePictureAndTypeResponseValidator.safeParse(response.data);
    if (success && data)
      return { avatarUrl: data.avatarUrl, userType: data.userType };
    return Promise.reject(
      new Error(i18next.t('get_user_profile_picture_and_type_error'))
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('get_user_profile_picture_and_type_error'))
    );
  }
}
