import type { Location } from './Location';

export type LocationSource =
  | 'client-ip'
  | 'client-current-location'
  | 'client-custom-location';

export type SearchFilters = {
  locationSource: LocationSource;
  location: Location;
  gender: 'Male' | 'Female' | 'All';
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: 'Neutered Only' | 'All';
  maxDistanceMeters: number;
};
