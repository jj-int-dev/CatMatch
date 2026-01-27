export type GetAnimalsRequest = {
  gender: 'Male' | 'Female' | null;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: boolean;
  latitude: number | null;
  longitude: number | null;
  locationSource:
    | 'client-ip'
    | 'client-current-location'
    | 'client-custom-location';
  locationDetails: string | null; //should be set if locationSource is 'client-custom-location'
  maxDistanceMeters: number;
};
