import { axiosGeoapifyClient } from '../utils/axios-client';
import i18next from '../utils/i18n';

export default async function (
  addressSearchText: string,
  languageCode: string
): Promise<any> {
  try {
    const resp = await axiosGeoapifyClient.get(
      `${import.meta.env.VITE_GEOAPIFY_AUTOCOMPLETE_API_URL_PATH}`,
      {
        params: { text: addressSearchText, lang: languageCode, format: 'json' }
      }
    );
    return resp.data;
  } catch (error) {
    return Promise.reject(new Error());
  }
}
