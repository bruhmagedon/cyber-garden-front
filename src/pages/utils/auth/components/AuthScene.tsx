import type { ReactNode } from 'react';
import BlurFade from '@/shared/ui/magic/blur-fade';
import DotPattern from '@/shared/ui/magic/dot-pattern';
import { SparklesCore } from '@/shared/ui/magic/sparkles';
import { cn } from '@/shared/utils';

type AuthSceneProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
};

export const AuthScene = ({ children, title, subtitle, className }: AuthSceneProps) => (
  <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-10">
    <BlurFade delay={0.2} className="w-full max-w-[520px]">
      {children}
    </BlurFade>
  </div>
);
