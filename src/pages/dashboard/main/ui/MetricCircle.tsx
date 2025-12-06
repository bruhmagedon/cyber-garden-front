'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/shared/utils';
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
  CircularProgressValueText,
} from '@/shared/ui/circular-progress'; // Adjust import path if needed based on where shadcn put it. User said src/shared/ui/circular-progress.tsx

interface MetricCircleProps {
  value: number; // 0 to 1 (or 0 to 100, handled internally)
  label: string;
  sublabel?: string;
  theme?: 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'purple' | 'orange';
  index?: number;
}

const THEMES = {
  default: {
    trackClass: 'text-muted-foreground/20',
    rangeClass: 'text-primary',
    textClass: 'text-foreground',
  },
  success: {
    trackClass: 'text-green-500/20',
    rangeClass: 'text-green-500',
    textClass: 'text-green-600 dark:text-green-400',
  },
  warning: {
    trackClass: 'text-yellow-500/20',
    rangeClass: 'text-yellow-500',
    textClass: 'text-yellow-600 dark:text-yellow-400',
  },
  destructive: {
    trackClass: 'text-red-500/20',
    rangeClass: 'text-red-500',
    textClass: 'text-red-600 dark:text-red-400',
  },
  info: {
    trackClass: 'text-blue-500/20',
    rangeClass: 'text-blue-500',
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    trackClass: 'text-purple-500/20',
    rangeClass: 'text-purple-500',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    trackClass: 'text-orange-500/20',
    rangeClass: 'text-orange-500',
    textClass: 'text-orange-600 dark:text-orange-400',
  },
};

export function MetricCircle({
  value,
  label,
  sublabel,
  theme = 'default',
  index = 0,
}: MetricCircleProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  // Normalize value to 0-100 for display
  const targetValue = value <= 1 ? value * 100 : value;

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 15,
    mass: 1,
  });

  const [displayValue, setDisplayValue] = React.useState(0);
  const themeStyles = THEMES[theme] || THEMES.default;

  React.useEffect(() => {
    if (isInView) {
      const delay = index * 100;
      const timer = setTimeout(() => {
        motionValue.set(targetValue);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, motionValue, targetValue, index]);

  React.useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return unsubscribe;
  }, [springValue]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border shadow-sm bg-background/60 backdrop-blur"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
    >
      <CircularProgress value={displayValue} size={120} thickness={8}>
        <CircularProgressIndicator>
          <CircularProgressTrack className={themeStyles.trackClass} />
          <CircularProgressRange className={themeStyles.rangeClass} />
        </CircularProgressIndicator>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={cn('text-2xl font-bold tabular-nums', themeStyles.textClass)}>
            {displayValue}%
          </span>
        </div>
      </CircularProgress>
      <div className="flex flex-col items-center gap-1 text-center">
        <h4 className="font-semibold text-sm">{label}</h4>
        {sublabel && <p className="text-muted-foreground text-xs max-w-[150px]">{sublabel}</p>}
      </div>
    </motion.div>
  );
}
