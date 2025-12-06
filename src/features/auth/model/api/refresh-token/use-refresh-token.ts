import { publicRqClient } from '@/shared/api/instance';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';
import { normalizeAuthUser } from '../../types';

export function useRefreshToken() {
  const { setAccessToken, clearTokens, setUser } = useAuthStore();

  const refreshMutation = publicRqClient.useMutation('post', '/api/v1/auth/token/refresh/', {
    onSuccess(data) {
      const authData = data as unknown as AuthTokenResponse;
      const accessToken = authData?.access_token;
      if (accessToken) {
        setAccessToken(accessToken);
        try {
          localStorage.setItem('auth_token', accessToken);
        } catch (error) {
          console.warn('Не удалось сохранить токен в localStorage', error);
        }
      } else {
        clearTokens();
        return;
      }

      const user = normalizeAuthUser(authData);
      if (user) {
        setUser(user);
      }
    },
    onError() {
      clearTokens();
    },
  });

  const refresh = () => {
    // Refresh token is sent automatically in HTTP-only cookie
    refreshMutation.mutate({
      body: {},
    });
  };

  return {
    refresh,
    isPending: refreshMutation.isPending,
    isSuccess: refreshMutation.isSuccess,
    isError: refreshMutation.isError,
    data: refreshMutation.data,
  };
}
