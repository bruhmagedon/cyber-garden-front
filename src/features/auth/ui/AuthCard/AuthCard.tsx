import type { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'sm:max-w-[540px]',
  md: 'sm:max-w-[640px]',
  lg: 'sm:max-w-135',
};

/**
 * Основной контейнер для карточек авторизации
 * Содержит базовые стили и адаптивность
 */
export const AuthCard = ({ children, maxWidth = 'sm' }: AuthCardProps) => {
  return (
    <div
      className={`flex h-screen w-screen flex-col items-center justify-center gap-7 rounded-xl border border-border bg-fill-primary px-8 py-10 sm:h-auto ${maxWidthClasses[maxWidth]} md:px-16 md:py-14`}
    >
      {children}
    </div>
  );
};
