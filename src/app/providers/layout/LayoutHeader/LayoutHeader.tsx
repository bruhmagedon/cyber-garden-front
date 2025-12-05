import { Menu } from 'lucide-react';
import Bell from '@/assets/icons/Bell.svg?react';
import { Button, useSidebar } from '@/shared/ui';
import { cn } from '@/shared/utils';

interface HeaderProps {
  className?: string;
}

export const LayoutHeader = ({ className }: HeaderProps) => {
  const { toggleSidebar } = useSidebar();

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
      {/* Burger Menu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 p-0 hover:bg-transparent md:hidden"
        aria-label="Открыть меню"
      >
        <Menu className="h-5 w-5 text-text-secondary" strokeWidth={2} />
      </Button>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="size-8 p-0 lg:size-7" aria-label="Уведомления">
          <Bell className="size-5 text-text-secondary lg:size-6" />
        </Button>
        {/* User Avatar */}
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl bg-sky-200 lg:h-7 lg:w-7">
          {/* Placeholder аватара - замена на реальное изображение после подключения API */}
          <div className="h-7 w-7 rounded-full bg-sky-400 lg:h-6 lg:w-6" />
        </div>
      </div>
    </header>
  );
};
