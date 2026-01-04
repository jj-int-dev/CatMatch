import { axiosRehomersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  animalId: string,
  animalPhotos: FormData,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    await axiosRehomersClient.post(
      `/${userId}/add-animal-photos/${animalId}`,
      animalPhotos,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
  } catch (error) {
    return Promise.reject(new Error(i18next.t('create_animal_listing_error')));
  }
}
