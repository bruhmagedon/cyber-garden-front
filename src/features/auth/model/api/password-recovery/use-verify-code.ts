import { publicRqClient } from '@/shared/api/instance';
import { formatErrorMessage } from '../utils/format-error';

interface VerifyCodeParams {
  email: string;
  code: string;
}

export function useVerifyRecoveryCode() {
  const verifyMutation = publicRqClient.useMutation(
    'post',
    '/api/v1/auth/verify-password-recovery-code/' as any,
    {
      onSuccess(data) {
        console.log('Code verified:', data);
      },
      onError(error) {
        console.error('Code verification error:', error);
      },
    },
  );

  const verifyCode = (params: VerifyCodeParams) => {
    verifyMutation.mutate({
      body: params as any,
    });
  };

  const errorMessage = verifyMutation.isError
    ? formatErrorMessage((verifyMutation.error as any)?.detail)
    : undefined;

  return {
    verifyCode,
    isPending: verifyMutation.isPending,
    isSuccess: verifyMutation.isSuccess,
    isError: verifyMutation.isError,
    errorMessage,
    data: verifyMutation.data,
  };
}
