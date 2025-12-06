import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button/Button';
import { cn } from '@/shared/utils';

interface SettingsSidebarProps {
  className?: string;
}

type NavItem = {
  id: string;
  labelKey: string;
  isActive?: boolean;
};

const navItems: NavItem[] = [
  { id: 'profile', labelKey: 'sidebar.profile', isActive: true },
  { id: 'interface', labelKey: 'sidebar.interface' },
  { id: 'language', labelKey: 'sidebar.language' },
  { id: 'notifications', labelKey: 'sidebar.notifications' },
];

// Функция для плавного скролла к секции
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

/**
 * Боковая навигация страницы настроек
 * Отображается только на десктопе (lg:flex)
 */
export const SettingsSidebar = ({ className }: SettingsSidebarProps) => {
  const { t } = useTranslation('settings');

  return (
    <nav className={cn('hidden w-52 flex-col gap-2 lg:flex', className)}>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => scrollToSection(item.id)}
          className={cn(
            'h-auto w-full justify-start rounded-lg px-4 transition-all',
            item.isActive
              ? 'bg-fill-secondary py-2.5 text-text-tertiary' // Активная вкладка
              : 'bg-fill-primary py-2 text-text-secondary hover:bg-hover-primary', // Неактивная вкладка
          )}
        >
          {t(item.labelKey)}
        </Button>
      ))}
    </nav>
  );
};
