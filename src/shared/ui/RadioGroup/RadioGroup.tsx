import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';

import { cn } from '@/shared/utils';

function RadioGroup({ className, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
}

function RadioGroupItem({ className, ref, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Базовые стили radio кнопки - адаптация под дизайн проекта
        'aspect-square h-5 w-5 rounded-full transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Состояние checked
        'data-[state=checked]:bg-primary',
        // Состояние unchecked - border вместо фона
        'data-[state=unchecked]:border-[1.72px] data-[state=unchecked]:border-fill-quaternary',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* Внутренний кружок для checked состояния */}
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FCFCFC' }} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
