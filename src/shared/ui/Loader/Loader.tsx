import { cn } from '@/shared/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';

const loaderVariants = cva('w-auto h-auto rounded-full', {
  variants: {
    theme: {
      primary: 'text-primary',
      twin: 'text-foreground',
      white: 'text-white',
    },
    size: {
      large: 'size-7',
      base: 'size-5',
      small: 'size-3.5',
    },
    default: {
      theme: 'primary',
      size: 'base',
    },
  },
});

interface LoaderProps extends VariantProps<typeof loaderVariants> {
  classNameIcon?: string;
  classNameContainer?: string;
  type?: 'page' | 'local';
}

export const Loader = ({
  theme = 'primary',
  size,
  classNameIcon,
  classNameContainer,
  type = 'local',
}: LoaderProps) => {
  if (type === 'page') {
    return (
      <div className={cn('grid min-h-screen place-content-center', classNameContainer)}>
        <Loader2Icon
          className={cn(
            'animate-spin rounded-full max-sm:size-16 md:h-22 lg:h-28',
            // loaderVariants({ theme }),
            classNameIcon,
          )}
        />
      </div>
    );
  }

  return (
    <div className={cn(classNameContainer)}>
      <Loader2Icon
        className={cn(
          'size-auto animate-spin rounded-full',
          // loaderVariants({ theme, size }),
          classNameIcon,
        )}
      />
    </div>
  );
};
