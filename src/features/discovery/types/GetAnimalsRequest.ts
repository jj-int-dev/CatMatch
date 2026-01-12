export type GetAnimalsRequest = {
  gender?: string;
  minAgeWeeks: number;
  maxAgeWeeks: number;
  neutered: boolean;
  latitude?: number;
  longitude?: number;
  maxDistanceMeters: number;
};
