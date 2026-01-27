import type { TFunction } from 'i18next';
import type { SearchFilters } from '../types/SearchFilters';

export type ValidationResult = {
  isValid: boolean;
  error: string | null;
};

export function searchFiltersValidator(
  searchFilters: SearchFilters,
  t: TFunction
): ValidationResult {
  const {
    locationSource,
    location: { formatted, city, latitude, longitude }
  } = searchFilters;

  if (
    locationSource === 'client-current-location' &&
    (!latitude || !longitude)
  ) {
    return {
      isValid: false,
      error: t('current_location_error')
    };
  }

  if (
    locationSource === 'client-custom-location' &&
    (formatted.trim().length === 0 ||
      !city ||
      city.trim().length === 0 ||
      !latitude ||
      !longitude)
  ) {
    return {
      isValid: false,
      error: t('invalid_address')
    };
  }

  return { isValid: true, error: null };
}
