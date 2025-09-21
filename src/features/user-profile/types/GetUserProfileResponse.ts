import type { GetUserProfileResponseSchema } from '../validators/getUserProfileResponseValidator';

export type GetUserProfileResponse = {
  userProfile?: GetUserProfileResponseSchema;
  error?: string;
};
