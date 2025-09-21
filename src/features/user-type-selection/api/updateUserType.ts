import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import { updateUserTypeResponseValidator } from '../validators/updateUserTypeResponseValidator';
import type { UpdateUserTypeResponse } from '../types/UpdateUserTypeResponse';

export default async function (
  userId: string,
  userType: string,
  accessToken: string,
  refreshToken: string
): Promise<UpdateUserTypeResponse> {
  try {
    const userTypeResponse = await axiosUsersClient.patch(
      `/${userId}/user-type`,
      { userType },
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = updateUserTypeResponseValidator.safeParse(
      userTypeResponse.data
    );
    if (success && data) return { userType: data.userType };
    throw new Error();
  } catch (error) {
    return { error: i18next.t('update_user_type_error') };
  }
}
