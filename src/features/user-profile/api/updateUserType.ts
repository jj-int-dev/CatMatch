import { axiosUsersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import {
  updateUserTypeResponseValidator,
  type UpdateUserTypeResponseSchema
} from '../validators/updateUserTypeResponseValidator';

export default async function (
  userId: string,
  userType: string,
  accessToken: string,
  refreshToken: string
): Promise<UpdateUserTypeResponseSchema> {
  try {
    const userTypeResponse = await axiosUsersClient.put(
      `/${userId}/user-type`,
      { userType },
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = updateUserTypeResponseValidator.safeParse(
      userTypeResponse.data
    );
    if (success && data) return data;
    return Promise.reject(new Error(i18next.t('update_user_type_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('update_user_type_error')));
  }
}
