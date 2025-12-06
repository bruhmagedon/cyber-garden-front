import { UploadCloud } from 'lucide-react';
import Bell from '@/assets/icons/Bell.svg?react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { FileUpload, FileUploadDropzone } from '@/shared/ui/file-upload';
import { UploadListContent } from '@/pages/dashboard/main/components/UploadListContent';
import { useDashboardContext } from '@/pages/dashboard/main/model/DashboardProvider';

interface HeaderProps {
  className?: string;
}

export const LayoutHeader = ({ className }: HeaderProps) => {
  const {
    user,
    apiData,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isUploading,
    handleUpload,
  } = useDashboardContext();
  const isRealData = Boolean(apiData);

  return (
    <header
      className={cn(
        'h-11 w-full flex-shrink-0 md:h-(--header-height)',
        'flex items-center justify-between',
        'px-5 py-3 md:py-2',
        'md:justify-end md:bg-background-secondary md:px-11',
        className,
      )}
    >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-in fade-in zoom-in duration-500">
                          С возвращением, {user.name} 👋
                          </h1>
                      </div>
                      <p className="text-text-secondary">
                         {isRealData ? "Анализ загруженных данных" : "Демонстрационный режим"}
                      </p>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      {/* Upload Button */}
                            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                          <DialogTrigger asChild>
                              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm">
                                  <UploadCloud size={18} />
                                  <span>Загрузить CSV</span>
                              </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                  <DialogTitle>Загрузка выписки</DialogTitle>
                                  <DialogDescription>
                                      Загрузите CSV файл с транзакциями для анализа категорий.
                                  </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                  <FileUpload 
                                      accept="text/csv" 
                                      maxFiles={1} 
                                      onUpload={handleUpload}
                                  >
                                      <FileUploadDropzone className="border-2 border-dashed border-border rounded-xl p-8 hover:bg-fill-secondary/50 transition-colors cursor-pointer text-center group">
                                          <div className="flex flex-col items-center gap-2">
                                              <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                                                  <UploadCloud size={24} />
                                              </div>
                                              <p className="text-sm font-medium">Перетащите файл сюда или кликните</p>
                                              <p className="text-xs text-text-tertiary">Поддерживается только CSV</p>
                                          </div>
                                      </FileUploadDropzone>
                                      <UploadListContent isUploading={isUploading} />
                                  </FileUpload>
                              </div>
                          </DialogContent>
                      </Dialog>
      
                      <Dialog>
                         <DialogTrigger asChild>
                            <button className="relative p-2.5 rounded-full hover:bg-fill-secondary transition-colors border border-border/50 group bg-background/50 backdrop-blur-sm">
                               <Bell className="w-5 h-5 text-text-secondary group-hover:text-foreground transition-colors" />
                               {MOCK_DATA.notificationsLog.some(n => !n.read) && (
                                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
                               )}
                            </button>
                         </DialogTrigger>
                         <DialogContent>
                            <DialogHeader>
                               <DialogTitle>Уведомления</DialogTitle>
                               <DialogDescription>История важных событый</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto pr-2">
                               {MOCK_DATA.notificationsLog.map(note => (
                                    <div key={note.id} className={cn("p-3 rounded-lg border", note.read ? "bg-background border-border" : "bg-fill-secondary border-primary/20")}>
                                       <div className="flex justify-between items-start mb-1">
                                          <span className="font-semibold text-sm">
                                             {note.type === 'budget_limit' ? 'Лимит бюджета' : 'Системное сообщение'}
                                          </span>
                                          <span className="text-[10px] text-text-tertiary">{new Date(note.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <p className="text-sm text-text-secondary">
                                          {note.type === 'budget_limit' 
                                            ? `Внимание! Лимит бюджета.` 
                                            : JSON.stringify(note.payload)}
                                       </p>
                                    </div>
                               ))}
                            </div>
                         </DialogContent>
                      </Dialog>
      
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 ring-2 ring-background">
                         {user.name[0]}
                      </div>
                   </div>
                </div>
      
    </header>
  );
};
