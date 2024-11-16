import type { RouteObject, RouteProps } from 'react-router-dom';

import { MainPage } from '@/pages/MainPage/MainPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';

export enum AppRoutes {
   MAIN = 'main',
   PROFILE = 'profile',
   NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
   [AppRoutes.MAIN]: '/',
   [AppRoutes.PROFILE]: '/profile',
   [AppRoutes.NOT_FOUND]: '*',
};

export const routeConfig: Record<AppRoutes, RouteObject> = {
   [AppRoutes.MAIN]: {
      path: RoutePath.main,
      element: <MainPage />,
   },
   [AppRoutes.PROFILE]: {
      path: RoutePath.profile,
      element: <ProfilePage />,
   },
   [AppRoutes.NOT_FOUND]: {
      path: RoutePath.profile,
      element: <NotFoundPage />,
   },
};
