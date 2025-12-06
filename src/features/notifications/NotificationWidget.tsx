'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils';
import { MOCK_DATA } from '@/pages/dashboard/main/mockData';
import { Skeleton } from '@/shared/ui';

export const NotificationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate fetching
  useEffect(() => {
     if (isOpen) {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
     }
  }, [isOpen]); // This generic useState usage is incorrect for side effects, should be useEffect. Fixing in content.

  // Local state for notifications to allow "mark as read" / "delete"
  const [notifications, setNotifications] = useState(MOCK_DATA.notificationsLog);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative rounded-full p-2.5 transition-all outline-none",
          isOpen 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "bg-background/50 border border-border/50 text-text-secondary hover:border-border hover:bg-fill-secondary hover:text-foreground hover:shadow-sm"
        )}
      >
        <Bell className={cn("h-5 w-5", isOpen && "fill-current")} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-[pulse_3s_infinite]" />
        )}
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="absolute right-0 mt-3 w-[380px] origin-top-right rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-fill-tertiary/20">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Уведомления</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Все прочитано
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
              {isLoading ? (
                 <div className="space-y-3 p-2">
                    {[1, 2, 3].map((i) => (
                       <div key={i} className="flex gap-3 items-start">
                          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                          <div className="space-y-2 flex-1">
                             <Skeleton className="h-4 w-3/4" />
                             <Skeleton className="h-10 w-full" />
                          </div>
                       </div>
                    ))}
                 </div>
              ) : notifications.length > 0 ? (
                notifications.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, padding: 0, margin: 0 }}
                    className={cn(
                      "relative group flex gap-3 p-3 rounded-xl transition-all border border-transparent",
                      note.read 
                        ? "hover:bg-fill-secondary/50 text-text-secondary" 
                        : "bg-primary/5 border-primary/10 hover:bg-primary/10 text-foreground"
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      "shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",
                      note.type === 'budget_limit'
                        ? "bg-red-500/10 border-red-500/20 text-red-500"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                      {note.type === 'budget_limit' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">
                          {note.type === 'budget_limit' ? 'Лимит бюджета' : 'Системное сообщение'}
                        </span>
                        <span className="text-[10px] text-text-tertiary shrink-0">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90 line-clamp-2">
                        {note.type === 'budget_limit'
                          ? `Внимание! Вы превышаете лимит бюджета в категории "Рестораны".`
                          : typeof note.payload === 'object' ? 'Обновление системы успешно завершено.' : String(note.payload)}
                      </p>
                    </div>

                    {/* Delete Action (visible on hover) */}
                    <button
                      onClick={(e) => handleDelete(note.id, e)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-background border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    
                    {/* Unread Indicator */}
                    {!note.read && (
                       <div className="absolute top-3 left-0 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-text-tertiary">
                  <div className="w-12 h-12 rounded-full bg-fill-secondary/50 flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 opacity-50" />
                  </div>
                  <p className="text-sm">Нет новых уведомлений</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border/40 bg-fill-tertiary/10 text-center">
              <button className="text-xs font-medium text-text-secondary hover:text-primary transition-colors py-1">
                Показать архив
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop to close when clicking outside (alternative to click-outside hook for simplicity) */}
      {isOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
