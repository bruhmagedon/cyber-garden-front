import { Suspense } from 'react';
import { createHashRouter, RouterProvider as ReactRouterProvider, RouteObject } from 'react-router-dom';
import {
  ErrorPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
} from '@/pages/utils';
import { Loader } from '@/shared/ui';
import { HomeLayout } from '../layout/Layout';
import { AuthInitializer } from './AuthInitializer';
import { AuthRoute } from './AuthRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DASHBOARD_ROUTES } from './routes/routes';

const appRouter = createHashRouter([
  {
    path: '/',
    errorElement: (
      <Suspense fallback={<Loader type="page" />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: 'auth',
        element: <AuthRoute />,
        children: [
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'register',
            element: <RegisterPage />,
          },

          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <HomeLayout />,
            children: Object.values(DASHBOARD_ROUTES satisfies Record<string, RouteObject>),
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const RouterProvider = () => (
  <AuthInitializer>
    <ReactRouterProvider router={appRouter} />
  </AuthInitializer>
);
