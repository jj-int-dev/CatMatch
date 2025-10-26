import { axiosUsersClient } from '../../../utils/axios-client';
import { updateUserProfilePictureResponseValidator } from '../validators/updateUserProfilePictureResponseValidator';
import type { UpdateUserProfilePictureResponse } from '../types/UpdateUserProfilePictureResponse';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  imageFormData: FormData,
  accessToken: string,
  refreshToken: string
): Promise<UpdateUserProfilePictureResponse> {
  try {
    const userProfilePictureResponse = await axiosUsersClient.put(
      `/${userId}/profile-picture`,
      imageFormData,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } =
      updateUserProfilePictureResponseValidator.safeParse(
        userProfilePictureResponse.data
      );
    if (success && data) return { avatarUrl: data.avatarUrl };
    return Promise.reject(
      new Error(i18next.t('update_user_profile_picture_error'))
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('update_user_profile_picture_error'))
    );
  }
}
