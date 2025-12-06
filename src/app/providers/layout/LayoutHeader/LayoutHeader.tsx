import { useState } from 'react';
import { CsvUploadWidget } from '@/features/csv-upload/CsvUploadWidget';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotificationWidget } from '@/features/notifications/NotificationWidget';
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { cn } from '@/shared/utils';

import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';

interface HeaderProps {
  className?: string;
}

export const LayoutHeader = ({ className }: HeaderProps) => {
  const { user, apiData } = useDashboardContext();
  const isRealData = Boolean(apiData);
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Welcome Section */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <h1
              onClick={() => navigate('/')}
              className="animate-in fade-in slide-in-from-left-4 duration-500 text-2xl font-bold tracking-tight md:text-3xl cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                {'Финансовый помощник'}
              </span>
            </h1>
          </div>
          {isRealData && (
            <p className="animate-in fade-in slide-in-from-left-4 delay-150 duration-500 text-sm font-medium text-muted-foreground">
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
          <CsvUploadWidget />

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
