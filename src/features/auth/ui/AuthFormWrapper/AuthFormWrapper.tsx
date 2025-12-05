import type { ReactNode } from 'react';

interface AuthFormWrapperProps {
  children: ReactNode;
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-5',
  md: 'gap-6',
  lg: 'gap-7',
};

/**
 * Обертка для содержимого формы
 */
export const AuthFormWrapper = ({ children, gap = 'lg' }: AuthFormWrapperProps) => {
  return <div className={`flex w-full flex-col ${gapClasses[gap]}`}>{children}</div>;
};
