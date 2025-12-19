import { useQuery } from '@tanstack/react-query';
import type { GetAddressSuggestionsResponseSchema } from '../validators/getAddressSuggestionsResponseValidator';
import getAddressSuggestions from '../api/getAddressSuggestions';

export default function (addressSearchText: string, languageCode: string) {
  return useQuery({
    queryKey: ['address-suggestions', addressSearchText, languageCode],
    queryFn: async (): Promise<GetAddressSuggestionsResponseSchema> =>
      await getAddressSuggestions(addressSearchText, languageCode),
    enabled: addressSearchText.trim().length > 3
  });
}
