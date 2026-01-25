export type GetAnimalsRequest = {
  gender?: string;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: boolean;
  latitude?: number;
  longitude?: number;
  locationSource:
    | 'client-ip'
    | 'client-current-location'
    | 'client-custom-location';
  locationDetails?: string; //should be set if locationSource is 'client-custom-location'
  maxDistanceMeters: number;
};
