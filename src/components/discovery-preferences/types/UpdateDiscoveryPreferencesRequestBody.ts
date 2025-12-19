import type { DiscoveryPreferencesSchema } from '../validators/discoveryPreferencesValidator';

export type UpdateDiscoveryPreferencesRequestBody =
  DiscoveryPreferencesSchema & {
    locationDisplayName: string;
    searchLocLatitude: number;
    searchLocLongitude: number;
  };
