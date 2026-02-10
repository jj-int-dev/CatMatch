import { axiosRehomersClient } from '../../../utils/axios-client';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import type { UpdateAnimalListingRequest } from '../types/UpdateAnimalListingRequest';

export default async function (
  userId: string,
  animalId: string,
  animalData: UpdateAnimalListingRequest,
  accessToken: string,
  refreshToken: string
): Promise<void> {
  try {
    await axiosRehomersClient.patch(
      `/${userId}/update-animal/${animalId}`,
      animalData,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    return Promise.reject(new Error(i18next.t('update_animal_listing_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('update_animal_listing_error')));
  }
}
