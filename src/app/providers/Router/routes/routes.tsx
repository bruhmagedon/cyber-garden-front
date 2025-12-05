import { RouteObject } from 'react-router-dom';
import { MainPage, MeetingsPage, ProjectsPage, SettingsPage } from '@/pages/dashboard';

export const DASHBOARD_ROUTES = {
  index: {
    index: true,
    path: '/',
    element: <MainPage />,
  } satisfies RouteObject,
  settings: {
    path: '/settings',
    element: <SettingsPage />,
  } satisfies RouteObject,
  meetings: {
    path: '/meetings',
    element: <MeetingsPage />,
  } satisfies RouteObject,
  projects: {
    path: '/projects',
    element: <ProjectsPage />,
  } satisfies RouteObject,
};

export type PathParams = {
  // [ROUTES.BOARD]: {
  //   boardId: string;
  // };
};

declare module 'react-router-dom' {
  interface Register {
    params: PathParams;
  }
}
