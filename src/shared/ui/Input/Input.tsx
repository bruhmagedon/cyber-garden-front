import * as React from 'react';
import DangerIcon from '@/assets/icons/Danger.svg?react';

import { cn } from '@/shared/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  title?: string;
  error?: string;
}

function Input({ className, type, title, error, ...props }: InputProps) {
  return (
    <div className={cn('flex w-full flex-col gap-3', className)}>
      {title && <div className="text-sm leading-tight">{title}</div>}
      <input
        data-error={!!error}
        type={type}
        data-slot="input"
        className={cn(
          'h-12 w-full overflow-hidden rounded-xl border border-fill-quaternary bg-fill-primary p-3',
          'font-semibold text-sm text-text-tertiary leading-tight placeholder:text-text-secondary',
          'transition-colors transition-shadow duration-200',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'data-[error=true]:border-danger data-[error=true]:focus-visible:ring-0',
          className,
        )}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1.75">
          <DangerIcon />
          <div className="font-medium text-danger text-sm">{error}</div>
        </div>
      )}
    </div>
  );
}

export { Input };
