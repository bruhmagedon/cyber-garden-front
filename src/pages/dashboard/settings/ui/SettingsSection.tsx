import { ReactNode } from 'react';
import { cn } from '@/shared/utils';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
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
        'flex scroll-mt-24 flex-col gap-6',
        'rounded-3xl border border-border/40 bg-background/20 p-8 backdrop-blur-xl', // More transparent background
        'w-full max-w-[800px]', // Enforce consistent max-width for all cards
        className,
      )}
    >
      {/* Заголовок секции */}
      <h2 className="font-semibold text-xl text-foreground/90">{title}</h2>

      {children}
    </section>
  );
};
