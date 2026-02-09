import { axiosGeoapifyClient } from '../utils/axios-client';
import {
  getAddressSuggestionsResponseValidator,
  type GetAddressSuggestionsResponseSchema
} from '../validators/addressSuggestionValidators';
import i18next from '../utils/i18n';

export default async function (
  addressSearchText: string,
  languageCode: string,
  signal?: AbortSignal
): Promise<GetAddressSuggestionsResponseSchema> {
  try {
    const response = await axiosGeoapifyClient.get(
      `${import.meta.env.VITE_GEOAPIFY_AUTOCOMPLETE_API_URL_PATH}`,
      {
        ...(signal && { signal }),
        params: {
          text: addressSearchText,
          type: 'street',
          limit: 5,
          lang: languageCode,
          format: 'json',
          filter: 'countrycode:auto'
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
  } catch (error: any) {
    // Axios throws on cancellation — ignore it
    if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    return Promise.reject(
      new Error(i18next.t('get_address_suggestions_error'))
    );
  }
}
