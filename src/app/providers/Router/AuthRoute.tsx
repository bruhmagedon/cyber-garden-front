import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/model/store/authStore';
import { StarsBackground } from '@/shared/ui/backgrounds/stars';
import DotPattern from '@/shared/ui/magic/dot-pattern';
import { cn } from '@/shared/utils';
import { useTheme } from '@/shared/hooks/useTheme/useTheme';
import { useEffect, useState } from 'react';

/**
 * Обертка для auth роутов (страниц авторизации)
 * Если пользователь уже авторизован - редиректит на главную
 * Если не авторизован - показывает auth страницы
 */
export const AuthRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (event: MediaQueryListEvent) => {
        setResolvedTheme(event.matches ? 'dark' : 'light');
      };
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const starColor = resolvedTheme === 'dark' ? '#FFF' : '#000';

  if (isAuthenticated) {
    // Если пользователь уже авторизован, редирект на главную
    return <Navigate to="/" replace />;
  }

  // Если не авторизован — рендер auth страниц
  return (
    <StarsBackground
      starColor={starColor}
      className={cn(
        'min-h-screen bg-background overflow-x-hidden relative',
        'dark:bg-[radial-gradient(ellipse_at_bottom,#262626_0%,#000_100%)]',
        'bg-[radial-gradient(ellipse_at_bottom,#f5f5f5_0%,#fff_100%)]',
      )}
    >
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]',
          'opacity-30 dark:opacity-20 fixed inset-0 z-0 text-primary/50',
        )}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Outlet />
      </div>
    </StarsBackground>
  );
};
