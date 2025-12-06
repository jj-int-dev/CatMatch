import { axiosRehomersClient } from '../../../utils/axios-client';
import {
  getAnimalListingResponseValidator,
  type GetAnimalListingResponseSchema
} from '../validators/getAnimalListingResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  animalId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetAnimalListingResponseSchema> {
  try {
    const animalListingResponse = await axiosRehomersClient.get(
      `/${userId}/animals/${animalId}`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getAnimalListingResponseValidator.safeParse(
      animalListingResponse.data
    );
    if (success) return data;
    return Promise.reject(new Error(i18next.t('get_animal_listing_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_animal_listing_error')));
  }
}
