import { publicRqClient } from '@/shared/api/instance';
import { formatErrorMessage } from '../utils/format-error';

export function usePasswordRecovery() {
  const recoveryMutation = publicRqClient.useMutation('post', '/api/v1/auth/password-recovery/' as any, {
    onSuccess(data) {
      console.log('Recovery code sent:', data);
    },
    onError(error) {
      console.error('Password recovery error:', error);
    },
  });

  const sendRecoveryCode = (email: string) => {
    recoveryMutation.mutate({
      body: { email } as any,
    });
  };

  const errorMessage = recoveryMutation.isError
    ? formatErrorMessage((recoveryMutation.error as any)?.detail)
    : undefined;

  return {
    sendRecoveryCode,
    isPending: recoveryMutation.isPending,
    isSuccess: recoveryMutation.isSuccess,
    isError: recoveryMutation.isError,
    errorMessage,
    data: recoveryMutation.data,
  };
}
