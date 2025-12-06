import { Theme } from '@/app/providers';
import { Moon, Sun, Monitor } from 'lucide-react';
import { RadioGroupItem } from '@/shared/ui/RadioGroup/RadioGroup';
import { cn } from '@/shared/utils';

interface ThemeCardProps {
  theme: Theme;
  label: string;
  isSelected: boolean;
  onSelect?: () => void;
}

/**
 * Карточка выбора темы с иконкой
 */
export const ThemeCard = ({ theme, label, isSelected, onSelect }: ThemeCardProps) => {
  const Icon = {
    dark: Moon,
    light: Sun,
    system: Monitor,
  }[theme];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 bg-fill-quaternary p-6 transition-all duration-200 cursor-pointer',
        'hover:border-primary/50 hover:bg-fill-tertiary',
        isSelected ? 'border-primary shadow-lg shadow-primary/20 bg-fill-tertiary' : 'border-fill-quaternary',
        'aspect-video w-full'
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      <div className={cn(
          "rounded-full p-4 transition-colors",
          isSelected ? "bg-primary/10 text-primary" : "bg-fill-secondary text-text-secondary"
      )}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      
      <div className="flex items-center gap-2">
         <RadioGroupItem value={theme} checked={isSelected} className="pointer-events-none" />
         <span className={cn("font-medium", isSelected ? "text-foreground" : "text-text-secondary")}>{label}</span>
      </div>
    </div>
  );
};
