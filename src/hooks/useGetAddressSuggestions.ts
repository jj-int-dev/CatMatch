import { useQuery } from '@tanstack/react-query';
import getAddressSuggestions from '../api/getAddressSuggestions';
import { useDebouncedValue } from './useDebouncedValue';
import type { LocationSource } from '../features/discovery/types/SearchFilters';

export default function useGetAddressSuggestions(
  addressSearchText: string,
  languageCode: string,
  locationSource: LocationSource
) {
  const debouncedSearchText = useDebouncedValue(
    addressSearchText,
    400 // 400ms debounce delay
  );

  return useQuery({
    queryKey: ['address-suggestions', debouncedSearchText, languageCode],
    queryFn: ({ signal }) =>
      getAddressSuggestions(debouncedSearchText, languageCode, signal),
    enabled:
      locationSource === 'client-custom-location' &&
      debouncedSearchText.trim().length >= 3,
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: false
  });
}
