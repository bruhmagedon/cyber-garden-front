import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/shared/config/api/config';
import { useAuthStore } from '../store';
import type { AuthUser } from '../types';
import { normalizeAuthUser } from '../types';

type AuthMeResponse = {
  user_id?: string;
  role?: string;
  email?: string;
  name?: string;
};

type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type AuthMeError = {
  detail?: string | ValidationErrorItem[];
  message?: string;
};

export const useAuthMe = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery<AuthUser | null, AuthMeError>({
    queryKey: ['authMe'],
    enabled: !!accessToken,
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) {
        throw { detail: 'Нет токена' };
      }

      const response = await fetch(`${API_CONFIG.API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json().catch(() => null)) as AuthMeResponse | AuthMeError | null;

      if (!response.ok || !data) {
        const errorPayload = (data as AuthMeError) ?? {};
        throw {
          detail: errorPayload.detail ?? errorPayload.message ?? 'Не удалось получить профиль',
        } satisfies AuthMeError;
      }

      const user = normalizeAuthUser({
        user_id: (data as AuthMeResponse).user_id,
        email: (data as AuthMeResponse).email,
        role: (data as AuthMeResponse).role,
        full_name: (data as AuthMeResponse).name,
      });

      return user;
    },
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return {
    ...query,
    user: query.data ?? null,
    refetchUser: query.refetch,
  };
};
