import { axiosGeoapifyClient } from '../utils/axios-client';
import {
  getAddressSuggestionsResponseValidator,
  type GetAddressSuggestionsResponseSchema
} from '../validators/getAddressSuggestionsResponseValidator';
import i18next from '../utils/i18n';

export default async function (
  addressSearchText: string,
  languageCode: string
): Promise<GetAddressSuggestionsResponseSchema> {
  try {
    const response = await axiosGeoapifyClient.get(
      `${import.meta.env.VITE_GEOAPIFY_AUTOCOMPLETE_API_URL_PATH}`,
      {
        params: {
          text: addressSearchText,
          limit: 5,
          lang: languageCode,
          format: 'json'
        }
      }
    );

    const { success, data } = getAddressSuggestionsResponseValidator.safeParse(
      response.data
    );

    if (success && data) return data;

    return Promise.reject(
      new Error(i18next.t('get_address_suggestions_error'))
    );
  } catch (error) {
    return Promise.reject(
      new Error(i18next.t('get_address_suggestions_error'))
    );
  }
}
