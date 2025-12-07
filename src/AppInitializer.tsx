import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/query-client';
import { Toaster } from '@/shared/ui/sonner';
import { RouterProvider } from './app/providers';

export const AppInitializer = () => {
  // const shouldFetchProfile = Boolean(
  //   localStorage.getItem("shouldFetchProfile"),
  // );

  // Если пользователь не авторизован, пропускаем запрос к профилю
  //   const { isFetching, isError } = profileUserAPI.useGetProfileUserQuery(undefined, {
  //   skip: !shouldFetchProfile,
  // });

  // Loader
  //   if (shouldFetchProfile && isFetching) {
  //   return <Loader type="page" />;
  // }

  // Ошибка запроса профиля
  //   if (shouldFetchProfile && isError) {
  //   console.warn('Error fetching profile user');
  //   localStorage.removeItem('shouldFetchProfile');
  // }

  // Если пользователь не авторизован или данные уже загружены
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
};
