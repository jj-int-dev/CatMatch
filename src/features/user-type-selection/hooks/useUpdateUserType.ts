import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../stores/auth-store';
import updateUserType from '../api/updateUserType';
import type { UpdateUserTypeResponse } from '../types/UpdateUserTypeResponse';

export default function () {
  const userSession = useAuthStore((state) => state.session);
  const userId = userSession?.user?.id ?? null;
  const accessToken = userSession?.access_token ?? null;
  const refreshToken = userSession?.refresh_token ?? null;

  return useMutation({
    mutationFn: async (userType: string): Promise<UpdateUserTypeResponse> =>
      await updateUserType(userId!, userType, accessToken!, refreshToken!)
  });
}
