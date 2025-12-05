import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/store/authStore';

/**
 * Обертка для auth роутов (страниц авторизации)
 * Если пользователь уже авторизован - редиректит на главную
 * Если не авторизован - показывает auth страницы
 */
export const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (isAuthenticated) {
    // Если пользователь уже авторизован, редирект на главную
    return <Navigate to="/" replace />;
  }

  // Если не авторизован — рендер auth страниц
  return <Outlet />;
};
