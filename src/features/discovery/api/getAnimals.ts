import { axiosAnimalsClient } from '../../../utils/axios-client';
import {
  getAnimalsResponseValidator,
  type GetAnimalsResponseSchema
} from '../validators/getAnimalsResponseValidator';
import i18next from '../../../utils/i18n';
import getTokenHeaders from '../../../utils/getTokenHeaders';
import type { GetAnimalsRequest } from '../types/GetAnimalsRequest';

export default async function (
  animalFilters: GetAnimalsRequest,
  accessToken: string,
  refreshToken: string,
  page: number = 1,
  pageSize: number = 10
): Promise<GetAnimalsResponseSchema> {
  try {
    const animalsResponse = await axiosAnimalsClient.post('', animalFilters, {
      headers: getTokenHeaders(accessToken, refreshToken),
      params: { page, pageSize }
    });
    const { success, data } = getAnimalsResponseValidator.safeParse(
      animalsResponse.data
    );
    if (success) return data;
    return Promise.reject(new Error(i18next.t('get_animals_error')));
  } catch (_error) {
    return Promise.reject(new Error(i18next.t('get_animals_error')));
  }
}
