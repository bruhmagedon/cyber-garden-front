import { rqClient } from '@/shared/api/instance';
import { useAuthStore } from '../store';
import type { AuthUser } from '../types';
import { normalizeAuthUser } from '../types';

export const useAuthMe = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const setUser = useAuthStore((state) => state.setUser);

  const query = rqClient.useQuery('get', '/auth_me' as any, {}, {
    enabled: !!accessToken,
    select: (data): AuthUser | null => normalizeAuthUser(data),
    onSuccess: (user: AuthUser | null) => {
      if (user) {
        setUser(user);
      }
    },
  });

  return {
    ...query,
    user: query.data ?? null,
    refetchUser: query.refetch,
  };
};
