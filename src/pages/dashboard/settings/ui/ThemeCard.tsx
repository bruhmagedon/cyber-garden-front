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

  const gradientClass = {
    dark: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white',
    light: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 text-slate-900',
    system: 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800 text-white',
  }[theme];

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer overflow-hidden group',
        gradientClass,
        'hover:shadow-xl hover:scale-[1.02]',
        isSelected ? 'border-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20' : 'border-transparent opacity-80 hover:opacity-100',
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
          "rounded-full p-4 transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm",
          isSelected ? "bg-white/20" : "bg-white/10"
      )}>
        <Icon size={32} strokeWidth={1.5} className={cn("transition-colors", isSelected ? "text-current" : "text-current/80")} />
      </div>
      
      <div className="flex items-center gap-2 z-10">
         <RadioGroupItem value={theme} checked={isSelected} className="pointer-events-none border-current/50 text-current" />
         <span className="font-medium text-current">{label}</span>
      </div>
    </div>
  );
};
