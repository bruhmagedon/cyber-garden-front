import { publicRqClient } from '@/shared/api/instance';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';

export function useRefreshToken() {
  const { setAccessToken, clearTokens } = useAuthStore();

  const refreshMutation = publicRqClient.useMutation('post', '/api/v1/auth/token/refresh/', {
    onSuccess(data) {
      const authData = data as unknown as AuthTokenResponse;
      if (authData?.access_token) {
        setAccessToken(authData.access_token);
      } else {
        clearTokens();
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
