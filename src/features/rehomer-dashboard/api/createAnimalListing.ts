import { axiosRehomersClient } from '../../../utils/axios-client';
import {
  createAnimalListingResponseValidator,
  type CreateAnimalListingResponseSchema
} from '../validators/createAnimalListingResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import type { CreateAnimalListingRequest } from '../types/CreateAnimalListingRequest';

export default async function (
  userId: string,
  animalData: CreateAnimalListingRequest,
  accessToken: string,
  refreshToken: string
): Promise<CreateAnimalListingResponseSchema> {
  try {
    const createAnimalListingResponse = await axiosRehomersClient.post(
      `/${userId}/add-animal`,
      animalData,
      { headers: getTokenHeaders(accessToken, refreshToken) }
    );
    const { success, data } = createAnimalListingResponseValidator.safeParse(
      createAnimalListingResponse.data
    );
    if (success && data) return data;
    return Promise.reject(new Error(i18next.t('create_animal_listing_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('create_animal_listing_error')));
  }
}
