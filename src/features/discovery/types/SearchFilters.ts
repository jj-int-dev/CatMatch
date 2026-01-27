import type { Location } from './Location';

export type SearchFilters = {
  locationSource:
    | 'client-ip'
    | 'client-current-location'
    | 'client-custom-location';
  location: Location;
  gender: 'Male' | 'Female' | 'All';
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: 'Neutered Only' | 'All';
  maxDistanceMeters: number;
};
