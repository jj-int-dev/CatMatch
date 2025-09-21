import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import { updateUserProfileResponseValidator } from '../validators/updateUserProfileResponseValidator';
import type { UpdateUserProfileResponse } from '../types/UpdateUserProfileResponse';

export default async function (
  userId: string,
  formData: FormData,
  accessToken: string,
  refreshToken: string
): Promise<UpdateUserProfileResponse> {
  try {
    const userProfileResponse = await axiosUsersClient.patch(
      `/${userId}/profile`,
      formData,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = updateUserProfileResponseValidator.safeParse(
      userProfileResponse.data
    );
    if (success && data) return { userProfile: data };
    throw new Error();
  } catch (error) {
    return { error: i18next.t('update_user_profile_error') };
  }
}
