'use client';

import { UploadCloud, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { FileUpload, FileUploadDropzone } from '@/shared/ui/file-upload';
import { UploadListContent } from '@/pages/dashboard/main/ui/UploadListContent';
import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';

export const CsvUploadWidget = () => {
  const { isUploadDialogOpen, setIsUploadDialogOpen, isUploading, handleUpload } =
    useDashboardContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUploadWrapper = async (files: File[]) => {
    await handleUpload(files);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsUploadDialogOpen(true)}
        className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-95"
      >
        <div className="absolute text-[0.8rem] inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer" />
        <span className='text-[0.8rem]'>Загрузить CSV</span>
      </button>
      <Dialog open={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)}>
        <DialogPanel
          className="max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
          showCloseButton={false}
        >
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
  );
};
