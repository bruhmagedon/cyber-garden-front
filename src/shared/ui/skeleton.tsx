import { cn } from '@/utils/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
   return <div className={cn('animate-pulse rounded-md bg-primary opacity-40', className)} {...props} />;
}

export { Skeleton };
