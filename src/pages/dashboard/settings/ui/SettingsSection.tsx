import { cn } from '@/shared/utils';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'full'; // default = 660px
  id?: string; // для якорных ссылок
}

/**
 * Обертка для секции настроек с заголовком
 * Обеспечивает консистентные отступы и стилизацию
 */
export const SettingsSection = ({
  title,
  children,
  className,
  maxWidth = 'default',
  id,
}: SettingsSectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        'flex scroll-mt-24 flex-col gap-6', // scroll-mt для отступа при скролле
        maxWidth === 'default' && 'max-w-[660px]',
        className,
      )}
    >
      {/* Заголовок секции */}
      <h2 className="font-semibold text-lg text-text-primary uppercase leading-normal">{title}</h2>

      {children}
    </section>
  );
};
