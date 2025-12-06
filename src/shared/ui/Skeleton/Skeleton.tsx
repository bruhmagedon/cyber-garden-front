import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/shared/utils';

interface SkeletonProps extends React.ComponentProps<'div'> {
  isLoading?: boolean;
}

function Skeleton({ className, isLoading, children, ...props }: SkeletonProps) {
  if (isLoading === undefined) {
    return (
      <div
        data-slot="skeleton"
        className={cn('animate-pulse rounded-md bg-fill-secondary/50', className)}
        {...props}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <div
            data-slot="skeleton"
            className={cn('animate-pulse rounded-md bg-fill-secondary/50', className)}
            {...props}
          />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Skeleton };
