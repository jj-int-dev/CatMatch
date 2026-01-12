import type { GetAnimalsRequest } from '../types/GetAnimalsRequest';
import type { SearchFilters } from '../types/SearchFilters';

export function createGetAnimalsRequestFromFormData(
  data: SearchFilters
): GetAnimalsRequest {
  const request: GetAnimalsRequest = {
    minAgeWeeks: data.minAgeWeeks,
    maxAgeWeeks: data.maxAgeWeeks,
    latitude: data.location.latitude!,
    longitude: data.location.longitude!,
    neutered: data.neutered === 'Neutered Only',
    maxDistanceMeters: data.maxDistanceMeters
  };

  if (data.gender !== 'All') {
    request.gender = data.gender;
  }

  return request;
}
