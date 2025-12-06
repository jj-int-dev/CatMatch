import { axiosRehomersClient } from '../../../utils/axios-client';
import {
  getAnimalListingsResponseValidator,
  type GetAnimalListingsResponseSchema
} from '../validators/getAnimalListingsResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetAnimalListingsResponseSchema> {
  try {
    const animalListingsResponse = await axiosRehomersClient.get(
      `/${userId}/animals`,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = getAnimalListingsResponseValidator.safeParse(
      animalListingsResponse.data
    );
    if (success) return data;
    return Promise.reject(new Error(i18next.t('get_animal_listings_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_animal_listings_error')));
  }
}
