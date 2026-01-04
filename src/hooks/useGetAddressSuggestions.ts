import { useQuery } from '@tanstack/react-query';
import getAddressSuggestions from '../api/getAddressSuggestions';
import { useDebouncedValue } from './useDebouncedValue';

export default function useAddressSuggestions(
  addressSearchText: string,
  languageCode: string
) {
  const debouncedSearchText = useDebouncedValue(
    addressSearchText,
    400 // 400ms debounce delay
  );

  return useQuery({
    queryKey: ['address-suggestions', debouncedSearchText, languageCode],
    queryFn: ({ signal }) =>
      getAddressSuggestions(debouncedSearchText, languageCode, signal),
    enabled: debouncedSearchText.trim().length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: false
  });
}
