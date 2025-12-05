import { Theme } from '@/app/providers';
import DarkThemePreview from '@/assets/Settings/DarkTheme.svg?react';
import LightThemePreview from '@/assets/Settings/LightTheme.svg?react';
import SystemThemePreview from '@/assets/Settings/SystemTheme.svg?react';
import { RadioGroupItem } from '@/shared/ui/RadioGroup/RadioGroup';
import { cn } from '@/shared/utils';

// import SystemThemePreview from '@/assets/Settings/SystemTheme.png'

interface ThemeCardProps {
  theme: Theme;
  label: string;
  isSelected: boolean;
  onSelect?: () => void;
}

/**
 * Карточка выбора темы с превью интерфейса
 * Отображает миниатюру интерфейса в выбранной теме
 */
export const ThemeCard = ({ theme, label, isSelected, onSelect }: ThemeCardProps) => {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    <div
      onClick={onSelect}
      className={cn(
        'relative h-40 w-44 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-fill-quaternary lg:h-56 lg:w-60 lg:rounded-[10.33px]',
        'border-2 transition-colors lg:border-2',
        isSelected ? 'border-primary' : 'border-fill-quaternary',
      )}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      {/* Превью темы */}
      <div className="absolute inset-x-0 top-2.5 flex justify-center lg:top-[20.66px]">
        {theme === 'dark' && <DarkThemePreview className="max-lg:h-[6.25rem] max-lg:w-[8.25rem]" />}
        {theme === 'light' && <LightThemePreview className="max-lg:h-[6.25rem] max-lg:w-[8.25rem]" />}
        {theme === 'system' && <SystemThemePreview className="max-lg:h-[6.25rem] max-lg:w-[8.25rem]" />}
      </div>

      {/* Нижняя панель с радио-кнопкой и лейблом */}
      <div className="absolute inset-x-0 bottom-0 flex h-9 items-center rounded-b-lg bg-fill-secondary px-[10px] lg:h-12 lg:px-[13.88px]">
        <div className="flex items-center gap-2 lg:gap-3">
          <RadioGroupItem value={theme} checked={isSelected} className="pointer-events-none" />
          <span className="font-medium text-text-tertiary text-xs lg:text-lg">{label}</span>
        </div>
      </div>
    </div>
  );
};

// Превью темной темы
// const DarkThemePreview = () => (
//   <div className="w-32 lg:w-44 h-24 lg:h-32 bg-fill-primary rounded-md relative">
//     {/* Боковая панель */}
//     <div className="absolute left-2 lg:left-[10.33px] top-2 lg:top-[10.33px] w-6 lg:w-9 h-1.5 lg:h-2 bg-primary rounded-2xl" />
//     <div className="absolute left-2 lg:left-[10.33px] top-[18px] lg:top-[24.11px] w-6 lg:w-9 h-1.5 lg:h-2 bg-fill-quaternary rounded-2xl" />
//     <div className="absolute left-2 lg:left-[10.33px] top-[30px] lg:top-[39.61px] w-6 lg:w-9 h-1.5 lg:h-2 bg-fill-quaternary rounded-2xl" />
//     <div className="absolute left-2 lg:left-[10.33px] top-[40px] lg:top-[53.38px] w-6 lg:w-9 h-1.5 lg:h-2 bg-fill-quaternary rounded-2xl" />
//     <div className="absolute left-2 lg:left-[10.33px] bottom-2 lg:bottom-[16.34px] w-6 lg:w-9 h-1.5 lg:h-2 bg-fill-quaternary rounded-2xl" />

//     {/* Основная область */}
//     <div className="absolute right-2 lg:right-[38.84px] top-[22px] lg:top-[29.27px] w-20 lg:w-28 h-16 lg:h-24 bg-fill-quaternary rounded-md border-[2.59px] lg:border-[3.44px] border-fill-tertiary" />
//     <div className="absolute left-[39px] lg:left-[51.66px] top-2 lg:top-[10.33px] w-6 lg:w-9 h-1.5 lg:h-2 bg-fill-quaternary rounded-2xl" />

//     {/* Иконки справа сверху */}
//     <div className="absolute right-2 lg:right-[19.29px] top-2 lg:top-[10.33px] w-1.5 lg:w-2 h-1.5 lg:h-2 bg-primary rounded-sm" />
//     <div className="absolute right-4 lg:right-[29.63px] top-2 lg:top-[10.33px] w-1.5 lg:w-2 h-1.5 lg:h-2 bg-fill-quaternary rounded-sm" />
//   </div>
// )

// // Превью светлой темы
// const LightThemePreview = () => (
//   <div className="w-32 lg:w-44 h-24 lg:h-32 rounded-md relative" style={{ backgroundColor: '#FFFFFF' }}>
//     <div className="absolute left-2 lg:left-[10.33px] top-2 lg:top-[10.33px] w-6 lg:w-9 h-1.5 lg:h-2 bg-primary rounded-2xl" />
//     <div className="absolute left-2 lg:left-[10.33px] top-[18px] lg:top-[24.11px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//     <div className="absolute left-2 lg:left-[10.33px] top-[30px] lg:top-[39.61px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//     <div className="absolute left-2 lg:left-[10.33px] top-[40px] lg:top-[53.38px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//     <div className="absolute left-2 lg:left-[10.33px] bottom-2 lg:bottom-[16.34px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />

//     <div className="absolute right-2 lg:right-[38.84px] top-[22px] lg:top-[29.27px] w-20 lg:w-28 h-16 lg:h-24 rounded-md border-[2.59px] lg:border-[3.44px]" style={{ borderColor: '#E8E8E8' }} />
//     <div className="absolute left-[39px] lg:left-[51.66px] top-2 lg:top-[10.33px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />

//     <div className="absolute right-2 lg:right-[19.29px] top-2 lg:top-[10.33px] w-1.5 lg:w-2 h-1.5 lg:h-2 bg-primary rounded-sm" />
//     <div className="absolute right-4 lg:right-[29.63px] top-2 lg:top-[10.33px] w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-sm" style={{ backgroundColor: '#E8E8E8' }} />
//   </div>
// )

// // Превью автоматической темы (split)
// const AutoThemePreview = () => (
//   <div className="w-32 lg:w-44 h-24 lg:h-32 rounded-md relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
//     {/* Левая половина - светлая */}
//     <div className="absolute inset-y-0 left-0 w-16 lg:w-[88.07px]">
//       <div className="absolute left-2 lg:left-[7.67px] top-2 lg:top-[7.67px] w-6 lg:w-9 h-1.5 lg:h-2 bg-primary rounded-2xl" />
//       <div className="absolute left-2 lg:left-[7.67px] top-[18px] lg:top-[17.90px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//       <div className="absolute left-2 lg:left-[7.67px] top-[30px] lg:top-[29.40px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//       <div className="absolute left-2 lg:left-[7.67px] top-[40px] lg:top-[39.63px] w-6 lg:w-9 h-1.5 lg:h-2 rounded-2xl" style={{ backgroundColor: '#E8E8E8' }} />
//     </div>

//     {/* Правая половина - темная */}
//     <div className="absolute inset-y-0 right-0 w-16 lg:w-24 bg-fill-primary rounded-r-md">
//       <div className="absolute right-2 lg:right-[36.26px] top-[22px] lg:top-[21.73px] w-20 lg:w-28 h-16 lg:h-24 bg-fill-quaternary rounded-md border-[2.56px] lg:border-[3.45px] border-fill-tertiary" />
//       <div className="absolute right-[51px] lg:right-[69.07px] top-2 lg:top-[7.67px] w-1.5 lg:w-2 h-1.5 lg:h-2 bg-primary rounded-sm" />
//       <div className="absolute right-[59px] lg:right-[79.29px] top-2 lg:top-[7.67px] w-1.5 lg:w-2 h-1.5 lg:h-2 bg-fill-quaternary rounded-sm" />
//     </div>

//     {/* Граница между половинами */}
//     <div className="absolute right-16 lg:right-[88.07px] top-[22px] lg:top-[21.73px] w-20 lg:w-28 h-16 lg:h-24 rounded-md border-[2.56px] lg:border-[3.45px]" style={{ borderColor: '#E8E8E8' }} />
//   </div>
// )
