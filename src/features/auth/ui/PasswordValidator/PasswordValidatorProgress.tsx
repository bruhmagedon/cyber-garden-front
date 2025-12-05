import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils';

interface Props extends HTMLAttributes<HTMLDivElement> {
  value?: number; // в процентах
}

export const PasswordValidatorProgress = ({ className, value = 0 }: Props) => {
  return (
    <div className={cn('relative h-1 w-full overflow-hidden rounded-3xl bg-border', className)}>
      <div
        className="absolute top-0 bottom-0 left-0 h-full rounded-3xl bg-primary duration-200 ease-linear"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};
