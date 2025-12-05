import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/store/authStore';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/auth/login" replace />;
  }

  // Если авторизован — рендер дочерних компонентов
  return <Outlet />;
};
