import { useAuthStore } from '@/features/auth/model/store/authStore';
import type { AuthTokenResponse } from '@/features/auth/model/types';
import { normalizeAuthUser } from '@/features/auth/model/types';
import { publicFetchClient } from '@/shared/api/instance';
import { Loader } from '@/shared/ui';
import { useEffect, useState } from 'react';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Компонент для автоматического обновления access_token при загрузке приложения
 * Если access_token нет в store, но refresh_token есть в куках - обновляем токен
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, setAccessToken, clearTokens, setUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Если уже есть access_token - ничего не делаем
      if (isAuthenticated()) {
        setIsInitialized(true);
        return;
      }

      // Пробуем обновить токен через refresh_token из куки
      // Refresh token отправляется автоматически в HTTP-only cookie
      try {
        const response = await publicFetchClient.POST('/api/v1/auth/token/refresh/', {
          body: {},
        });

        if (response.data) {
          const authData = response.data as unknown as AuthTokenResponse;
          if (authData.access_token) {
            setAccessToken(authData.access_token);
            try {
              localStorage.setItem('auth_token', authData.access_token);
            } catch (error) {
              console.warn('Не удалось сохранить токен в localStorage', error);
            }
            console.log('Access token refreshed successfully');
          }

          const user = normalizeAuthUser(authData);
          if (user) {
            setUser(user);
          }
        }
      } catch (_error) {
        // Если refresh не удался - очищаем токены
        console.log('No valid refresh token found');
        clearTokens();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isAuthenticated, setAccessToken, clearTokens]);

  if (!isInitialized) {
    return <Loader type="page" />;
  }

  return <>{children}</>;
};
