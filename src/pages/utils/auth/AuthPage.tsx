import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/features/auth/model/store/authStore';

//todo отдельные роуты ✓, редирект ✓ и добавить токен при регистрации, доделать код сброса пароля, убрать прокси ✓, почистить код, сделать слоты ✓

//todo сбрасывать форму при успешной регистрации

/**
 * @deprecated This component is deprecated. Use separate route components instead:
 * - LoginPage for /auth/login
 * - RegisterPage for /auth/register
 * - ForgotPasswordPage for /auth/forgot-password
 * - VerifyCodePage for /auth/verify-code
 * - ResetPasswordPage for /auth/reset-password
 */
const AuthPageAsync = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const navigate = useNavigate();

  // Редирект на главную если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background sm:p-4">
      <LoginForm />
    </div>
  );
};

export default AuthPageAsync;
