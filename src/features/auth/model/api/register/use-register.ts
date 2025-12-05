import { publicRqClient } from '@/shared/api/instance';
import type { ApiSchemas } from '@/shared/api/schema';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';
import { formatErrorMessage } from '../utils/format-error';

export function useRegister() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const registerMutation = publicRqClient.useMutation('post', '/register' as any, {
    onSuccess(data) {
      console.log('Registration successful:', data);

      // Save only access_token to store (refresh_token is in HTTP-only cookie)
      const authData = data as unknown as AuthTokenResponse;
      const token = authData.access_token ?? authData.token;
      if (token) {
        setAccessToken(token);
      }
    },
    onError(error) {
      console.error('Registration error:', error);
    },
  });

  const register = (data: ApiSchemas['UserRegisterDTO']) => {
    registerMutation.mutate({
      body: {
        email: data.email,
        password: data.password,
        fullName: (data as any).full_name ?? (data as any).fullName ?? '',
      } as any,
      headers: { 'Content-Type': 'application/json' } as any,
    });
  };

  const errorMessage = registerMutation.isError
    ? formatErrorMessage(registerMutation.error.detail)
    : undefined;

  return {
    register,
    isPending: registerMutation.isPending,
    isSuccess: registerMutation.isSuccess,
    isError: registerMutation.isError,
    errorMessage,
    data: registerMutation.data,
  };
}
