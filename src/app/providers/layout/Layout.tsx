import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader } from '@/shared/ui';
import { DashboardProvider } from '@/pages/dashboard/main/model/DashboardProvider';
import { LayoutHeader } from './LayoutHeader/LayoutHeader';

export const HomeLayout = () => {
  return (
    <Suspense fallback={<Loader type="page" />}>
      <DashboardProvider>
        <LayoutHeader className="sticky top-0 z-40" />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </DashboardProvider>
    </Suspense>
  );
};
