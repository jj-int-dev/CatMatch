import { axiosUsersClient } from '../../../utils/axios-client';
import { getUserProfilePictureAndTypeResponseValidator } from '../validators/getUserProfilePictureAndTypeResponseValidator';
import type { GetUserProfilePictureAndTypeResponse } from '../types/GetUserProfilePictureAndTypeResponse';
import getTokenHeaders from '../../../utils/getTokenHeaders';

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
    throw new Error();
  } catch (error) {
    return { avatarUrl: null, userType: null };
  }
}
