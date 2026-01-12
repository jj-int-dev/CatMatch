import { axiosAnimalsClient } from '../../../utils/axios-client';
import {
  getAnimalResponseValidator,
  type GetAnimalResponseSchema
} from '../validators/getAnimalResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';

export default async function (
  animalId: string,
  accessToken: string,
  refreshToken: string
): Promise<GetAnimalResponseSchema> {
  try {
    const animalResponse = await axiosAnimalsClient.get(`/${animalId}`, {
      headers: getTokenHeaders(accessToken, refreshToken)
    });
    const { success, data } = getAnimalResponseValidator.safeParse(
      animalResponse.data
    );
    if (success) return data;
    return Promise.reject(new Error(i18next.t('get_animal_error')));
  } catch (error) {
    return Promise.reject(new Error(i18next.t('get_animal_error')));
  }
}
