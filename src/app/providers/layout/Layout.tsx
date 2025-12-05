import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Loader, SidebarInset, SidebarProvider } from '@/shared/ui';
import { LayoutHeader } from './LayoutHeader/LayoutHeader';
import { LayoutSidebar } from './LayoutSidebar/LayoutSidebar';

export const HomeLayout = () => {
  return (
    <Suspense fallback={<Loader type="page" />}>
      <SidebarProvider defaultOpen={true}>
        <LayoutSidebar />
        <SidebarInset className="flex flex-col bg-background">
          <LayoutHeader className="sticky top-0 z-40" />
          <main className="flex-1 overflow-y-auto px-20 py-10">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
};
