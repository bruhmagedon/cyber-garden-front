import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/shared/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none',
  {
    variants: {
      variant: {
        // Основная кнопка проекта (синяя)
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        // Вторичная кнопка (серая с обводкой)
        secondary:
          'bg-button-secondary text-text-tertiary hover:bg-button-secondary-hover border border-fill-quaternary font-bold',
        // Стандартная кнопка (для совместимости с shadcn)
        default: 'bg-primary text-on-primary hover:bg-primary-hover',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border border-fill-quaternary bg-transparent hover:bg-hover-primary',
        ghost: 'hover:bg-hover-primary',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3 py-1.5',
        sm: 'h-8 px-2.5 py-1',
        md: 'h-11 px-3 py-1.5',
        lg: 'h-12 px-4 py-3',
        icon: 'size-9',
        'icon-sm': 'size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
