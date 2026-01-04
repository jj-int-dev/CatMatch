export type UpdateAnimalListingRequest = {
  name?: string;
  gender?: 'Male' | 'Female';
  ageInWeeks?: number;
  neutered?: boolean;
  addressDisplayName?: string;
  description?: string;
  address?: {
    latitude: number;
    longitude: number;
  };
};
