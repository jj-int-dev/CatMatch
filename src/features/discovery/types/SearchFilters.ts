import type { Location } from './Location';

export type SearchFilters = {
  location: Location;
  gender: 'Male' | 'Female' | 'All';
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: 'Neutered Only' | 'All';
  maxDistanceMeters: number;
};
