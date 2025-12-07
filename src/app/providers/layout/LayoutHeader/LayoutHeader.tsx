import { useState } from 'react';
import { CsvUploadWidget } from '@/features/csv-upload/CsvUploadWidget';
import Logo from '@/assets/icons/logo.svg?react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { NotificationWidget } from '@/features/notifications/NotificationWidget';
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Sheet,
  SheetContent,
  SheetTrigger,
  Button
} from '@/shared/ui';
import { cn } from '@/shared/utils';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { footerItems, navigationItems, settingsItem } from '../LayoutSidebar/sidebarConfig';
import { useAuthStore } from '@/features/auth';
import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';

interface HeaderProps {
  className?: string;
}

export const LayoutHeader = ({ className }: HeaderProps) => {
  const { user, apiData } = useDashboardContext();
  const { t } = useTranslation('global');
  const isRealData = Boolean(apiData);
  const navigate = useNavigate();
  const location = useLocation();
  const { clearTokens } = useAuthStore();

  return (
    <header
      className={cn(
        'sticky top-6 mt-6 z-40 w-[92%] max-w-7xl mx-auto rounded-2xl',
        'h-(--header-height)',
        'border border-white/10 bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5',
        'px-6 py-4 md:px-8',
        'transition-all duration-300',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4">
        {/* Welcome Section */}
        <div className="flex items-center gap-5">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                 <div className="flex flex-col gap-6 py-4">
                  <div className="px-2 space-y-1">
                    <h2 className="text-xl font-bold">Меню</h2>
                    <p className="text-sm font-medium text-muted-foreground min-[525px]:hidden">Финансовый помощник</p>
                  </div>
                  
                  <div className="px-2">
                    <CsvUploadWidget />
                  </div>

                   <div className="flex flex-col gap-2">
                    {navigationItems.map((item) => {
                       const isActive = location.pathname === item.url;
                       return (
                         <Link
                           key={item.titleKey}
                           to={item.url}
                           className={cn(
                             "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                             isActive 
                               ? "bg-primary/10 text-primary font-medium" 
                               : "hover:bg-muted text-muted-foreground hover:text-foreground"
                           )}
                         >
                           <item.icon className="h-5 w-5" />
                           {t(item.titleKey)}
                         </Link>
                       );
                    })}
                   </div>

                   <div className="h-px bg-border my-2" />

                   <div className="flex flex-col gap-2">
                    {settingsItem.map((item) => {
                       const isActive = location.pathname === item.url;
                       return (
                         <Link
                           key={item.titleKey}
                           to={item.url}
                           className={cn(
                             "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                             isActive 
                               ? "bg-primary/10 text-primary font-medium" 
                               : "hover:bg-muted text-muted-foreground hover:text-foreground"
                           )}
                         >
                           <item.icon className="h-5 w-5" />
                           {t(item.titleKey)}
                         </Link>
                       );
                    })}
                   </div>

                   <div className="h-px bg-border my-2" />

                   <div className="flex flex-col gap-2">
                    {footerItems.map((item) => (
                       <button
                         key={item.titleKey}
                         onClick={() => {
                           if (item.action === 'logout') {
                             clearTokens();
                             navigate('/auth/login');
                           }
                         }}
                         className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground w-full text-left"
                       >
                         <item.icon className="h-5 w-5" />
                         {t(item.titleKey)}
                       </button>
                    ))}
                   </div>
                 </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2">
            <h1
              onClick={() => navigate('/')}
              className="animate-in fade-in slide-in-from-left-4 duration-500 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {/* Text for >= 525px */}
              <span className="hidden min-[525px]:block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent text-xl font-bold tracking-tight md:text-3xl">
                {'Финансовый помощник'}
              </span>
              {/* Upload Button for < 525px */}
              <div className="block min-[525px]:hidden" onClick={(e) => e.stopPropagation()}>
                <CsvUploadWidget />
              </div>
            </h1>
          </div>
          {isRealData && (
            <p className="hidden md:block animate-in fade-in slide-in-from-left-4 delay-150 duration-500 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Анализ загруженных данных
              </span>
            </p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Upload Button */}
          <div className="hidden md:block">
            <CsvUploadWidget />
          </div>

          {/* Notifications */}
          <NotificationWidget />

          {/* User Avatar */}
          <div
            onClick={() => navigate('/settings')}
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-sm font-bold text-white shadow-lg shadow-primary/20 ring-2 ring-background transition-transform hover:scale-105 active:scale-95"
          >
            {user.name[0]}
          </div>
        </div>
      </div>
    </header>
  );
};
