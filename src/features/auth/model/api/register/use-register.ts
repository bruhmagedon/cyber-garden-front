import { useMutation } from '@tanstack/react-query';
import { API_CONFIG } from '@/shared/config/api/config';
import { useAuthStore } from '../../store';
import type { AuthTokenResponse } from '../../types';
import { normalizeAuthUser } from '../../types';
import { formatErrorMessage } from '../utils/format-error';

type RegisterPayload = {
  email: string;
  name: string;
  password: string;
};

type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type: string;
};

type RegisterError = {
  detail?: string | ValidationErrorItem[];
  message?: string;
};

const registerRequest = async ({ email, name, password }: RegisterPayload): Promise<AuthTokenResponse> => {
  const response = await fetch(`${API_CONFIG.API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, name, password }),
  });

  const data = (await response.json().catch(() => null)) as AuthTokenResponse | RegisterError | null;

  if (!response.ok || !data) {
    const errorPayload = (data as RegisterError) ?? {};
    throw {
      detail: errorPayload.detail ?? errorPayload.message ?? 'Не удалось выполнить регистрацию',
    } satisfies RegisterError;
  }

  return data as AuthTokenResponse;
};

export function useRegister() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const registerMutation = useMutation<AuthTokenResponse, RegisterError, RegisterPayload>({
    mutationFn: registerRequest,
    onSuccess(data) {
      console.log('Registration successful:', data);

      // Save only access_token to store (refresh_token is in HTTP-only cookie)
      const authData = data as unknown as AuthTokenResponse;
      const token = authData.access_token ?? authData.token;
      if (token) {
        setAccessToken(token);
        try {
          localStorage.setItem('auth_token', token);
        } catch (error) {
          console.warn('Не удалось сохранить токен в localStorage', error);
        }
      }

      const user = normalizeAuthUser(authData);
      if (user) {
        setUser(user);
      }
    },
    onError(error) {
      console.error('Registration error:', error);
    },
  });

  const register = (data: RegisterPayload) => {
    registerMutation.mutate(data);
  };

  const errorMessage = registerMutation.isError
    ? formatErrorMessage(registerMutation.error?.detail ?? undefined)
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
