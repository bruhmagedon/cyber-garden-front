import { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Bell from '@/assets/icons/Bell.svg?react';
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { cn } from '@/shared/utils';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { FileUpload, FileUploadDropzone } from '@/shared/ui/file-upload';
import { UploadListContent } from '@/pages/dashboard/main/components/UploadListContent';
import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';

interface HeaderProps {
  className?: string;
}

export const LayoutHeader = ({ className }: HeaderProps) => {
  const { user, apiData, isUploadDialogOpen, setIsUploadDialogOpen, isUploading, handleUpload } =
    useDashboardContext();
  const isRealData = Boolean(apiData);
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleUploadWrapper = async (files: File[]) => {
    await handleUpload(files);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'h-(--header-height)',
        'border-b border-border/40 bg-background/10 backdrop-blur-xl',
        'px-6 py-4 md:px-8',
        'transition-all duration-300',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Welcome Section */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <h1 className="animate-in fade-in slide-in-from-left-4 duration-500 text-2xl font-bold tracking-tight md:text-3xl">
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                {'Unknown'}
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUploadDialogOpen(true)}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer" />
              <UploadCloud
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
              <span>Загрузить CSV</span>
            </button>
            <Dialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)}>
              <DialogPanel className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl" showCloseButton={false}>
                <DialogClose
                  type="button"
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-fill-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Закрыть</span>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle>Загрузка выписки</DialogTitle>
                  <DialogDescription>
                    Загрузите CSV файл с транзакциями для анализа категорий.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <FileUpload accept="text/csv" maxFiles={1} onUpload={handleUploadWrapper}>
                    <FileUploadDropzone className="group cursor-pointer rounded-xl border-2 border-dashed border-border p-8 text-center transition-colors hover:bg-muted/50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                          <UploadCloud size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Перетащите файл сюда или кликните</p>
                          <p className="text-xs text-muted-foreground">Поддерживается только CSV</p>
                        </div>
                      </div>
                    </FileUploadDropzone>
                    <UploadListContent isUploading={isUploading} />
                  </FileUpload>
                </div>
              </DialogPanel>
            </Dialog>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="group relative rounded-full border border-border/50 bg-background/50 p-2.5 backdrop-blur-sm transition-all hover:border-border hover:bg-accent hover:shadow-sm active:scale-95"
            >
              <Bell className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              {MOCK_DATA.notificationsLog.some((n) => !n.read) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
              )}
            </button>
            <Dialog open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)}>
              <DialogPanel className="max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl" showCloseButton={false}>
                <DialogClose
                  type="button"
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-fill-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Закрыть</span>
                </DialogClose>
                <DialogHeader>
                  <DialogTitle>Уведомления</DialogTitle>
                  <DialogDescription>История важных событий</DialogDescription>
                </DialogHeader>
                <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                  {MOCK_DATA.notificationsLog.map((note) => (
                    <div
                      key={note.id}
                      className={cn(
                        'relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-sm',
                        note.read ? 'bg-background border-border' : 'bg-muted/30 border-primary/20',
                      )}
                    >
                      {!note.read && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                      )}
                      <div className="mb-1 flex items-start justify-between">
                        <span className="font-semibold text-sm">
                          {note.type === 'budget_limit' ? 'Лимит бюджета' : 'Системное сообщение'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {note.type === 'budget_limit'
                          ? `Внимание! Лимит бюджета.`
                          : JSON.stringify(note.payload)}
                      </p>
                    </div>
                  ))}
                </div>
              </DialogPanel>
            </Dialog>
          </div>

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
