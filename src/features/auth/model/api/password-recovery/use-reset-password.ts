import { publicRqClient } from '@/shared/api/instance';
import { formatErrorMessage } from '../utils/format-error';

interface ResetPasswordParams {
  token: string;
  email: string;
  new_password: string;
}

export function useResetPassword() {
  const resetMutation = publicRqClient.useMutation(
    'post',
    '/api/v1/auth/reset-password-with-code/{token}' as any,
    {
      onSuccess(data) {
        console.log('Password reset successful:', data);
      },
      onError(error) {
        console.error('Reset password error:', error);
      },
    },
  );

  const resetPassword = (params: ResetPasswordParams) => {
    const { token, email, new_password } = params;
    resetMutation.mutate({
      params: { path: { token } },
      body: { email, new_password } as any,
    });
  };

  const errorMessage = resetMutation.isError
    ? formatErrorMessage((resetMutation.error as any)?.detail)
    : undefined;

  return {
    resetPassword,
    isPending: resetMutation.isPending,
    isSuccess: resetMutation.isSuccess,
    isError: resetMutation.isError,
    errorMessage,
    data: resetMutation.data,
  };
}
