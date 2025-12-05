import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/shared/utils';

function Switch({ className, ref, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // Базовые стили - адаптация под дизайн проекта
        'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Состояние checked - используем --primary
        'data-[state=checked]:bg-primary',
        // Состояние unchecked - используем --text-primary
        'data-[state=unchecked]:bg-text-primary',
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          // Стили для переключателя (thumb)
          'pointer-events-none block h-5 w-5 rounded-full bg-fill-quaternary shadow-lg transition-transform',
          // Позиционирование
          'data-[state=checked]:translate-x-[26px] data-[state=unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
