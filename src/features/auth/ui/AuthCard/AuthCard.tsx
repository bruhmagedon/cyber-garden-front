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
      className={`relative w-full rounded-[32px] border border-white/10 bg-background/60 px-8 py-10 text-white shadow-[0_25px_90px_rgba(21,1,31,0.85)] backdrop-blur-xl ${maxWidthClasses[maxWidth]} md:px-14 md:py-14`}
    >
      <div className="relative z-10 flex w-full flex-col gap-8">{children}</div>
    </div>
  );
};
