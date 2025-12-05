import { publicRqClient } from '@/shared/api/instance';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';
import { formatErrorMessage } from '../utils/format-error';

export function useLogin() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const loginMutation = publicRqClient.useMutation('post', '/auth' as any, {
    onSuccess(data) {
      console.log('✅ Login API Success:', data);

      // Save only access_token to store (refresh_token is in HTTP-only cookie)
      const authData = data as unknown as AuthTokenResponse;
      const token = authData.access_token ?? authData.token;
      console.log('🔑 Access token:', token);

      if (token) {
        setAccessToken(token);
        console.log('✅ Token saved to store');
      } else {
        console.warn('⚠️ No access_token in response!');
      }
    },
    onError(error) {
      console.error('❌ Login error:', error);
    },
  });

  const login = (email: string, password: string) => {
    loginMutation.mutate({
      body: {
        email,
        password,
      } as any,
      headers: { 'Content-Type': 'application/json' } as any,
    });
  };

  const errorMessage = loginMutation.isError ? formatErrorMessage(loginMutation.error.detail) : undefined;

  return {
    login,
    isPending: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
    errorMessage,
    data: loginMutation.data,
  };
}
