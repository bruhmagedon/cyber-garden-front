import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from '@/shared/config/api/config';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';
import { normalizeAuthUser } from '../../types';
import { formatErrorMessage } from '../utils/format-error';

type LoginPayload = {
  email: string;
  password: string;
};

type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type LoginError = {
  detail?: string | ValidationErrorItem[];
  message?: string;
};

const loginRequest = async ({ email, password }: LoginPayload): Promise<AuthTokenResponse> => {
  const response = await fetch(`${API_CONFIG.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json().catch(() => null)) as AuthTokenResponse | LoginError | null;

  if (!response.ok || !data) {
    const errorPayload = (data as LoginError) ?? {};
    throw {
      detail: errorPayload.detail ?? errorPayload.message ?? 'Не удалось выполнить вход',
    } satisfies LoginError;
  }

  return data as AuthTokenResponse;
};

export function useLogin() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation<AuthTokenResponse, LoginError, LoginPayload>({
    mutationFn: loginRequest,
    onSuccess(data) {
      console.log('✅ Login API Success:', data);

      // Save only access_token to store (refresh_token is in HTTP-only cookie)
      const authData = data as unknown as AuthTokenResponse;
      const token = authData.access_token ?? authData.token;
      console.log('🔑 Access token:', token);

      if (token) {
        setAccessToken(token);
        try {
          localStorage.setItem('auth_token', token);
        } catch (error) {
          console.warn('Не удалось сохранить токен в localStorage', error);
        }
        console.log('✅ Token saved to store');
      } else {
        console.warn('⚠️ No access_token in response!');
      }

      const user = normalizeAuthUser(authData);
      if (user) {
        setUser(user);
      }
    },
    onError(error) {
      console.error('❌ Login error:', error);
    },
  });

  const login = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const errorMessage = loginMutation.isError
    ? formatErrorMessage(loginMutation.error?.detail ?? undefined)
    : undefined;

  return {
    login,
    isPending: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    isError: loginMutation.isError,
    errorMessage,
    data: loginMutation.data,
  };
}
