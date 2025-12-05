import { useCallback } from 'react';

export type AuthView = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'reset-password';

export const useAuthNavigation = (onNavigate: (view: AuthView) => void) => {
  const goToLogin = useCallback(() => onNavigate('login'), [onNavigate]);
  const goToRegister = useCallback(() => onNavigate('register'), [onNavigate]);
  const goToForgotPassword = useCallback(() => onNavigate('forgot-password'), [onNavigate]);
  const goToVerifyCode = useCallback(() => onNavigate('verify-code'), [onNavigate]);
  const goToResetPassword = useCallback(() => onNavigate('reset-password'), [onNavigate]);

  return {
    goToLogin,
    goToRegister,
    goToForgotPassword,
    goToVerifyCode,
    goToResetPassword,
  };
};
