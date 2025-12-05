import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils';
import { PASSWORD_REQUIREMENTS } from './data';

interface Props extends HTMLAttributes<HTMLDivElement> {
  password: string;
}

export const PasswordValidator = ({ password, className }: Props) => {
  const rules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const totalRules = Object.keys(rules).length;
  const passedRules = Object.values(rules).filter(Boolean).length;
  const progress = Math.round((passedRules / totalRules) * 100);

  return (
    <div className="absolute bottom-[calc(100%+0.5rem)] left-0">
      <div
        className={cn('relative w-72 rounded-lg border border-border bg-fill-primary p-3.5 pb-1', className)}
      >
        {/* Треугольник снизу слева */}
        <div className="-bottom-2 absolute left-4 h-2 w-4 overflow-hidden">
          <div className="-top-2 relative h-3 w-3 rotate-45 border border-border bg-fill-primary" />
        </div>

        {/* Надежность пароля */}
        <p className="font-inter font-medium text-text-secondary text-xs">Надежность пароля {progress}%</p>

        {/* Progress bar */}
        <div className="relative my-2 h-1 w-full overflow-hidden rounded-3xl bg-border">
          <div
            className="absolute top-0 bottom-0 left-0 h-full rounded-3xl bg-primary duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Требования */}
        <p className="font-inter font-medium text-text-secondary text-xs">Требования к паролю</p>

        {/* Список требований */}
        <div className="mt-2 flex flex-col gap-0.5">
          {PASSWORD_REQUIREMENTS.map(({ key, text }) => {
            const isActive = rules[key as keyof typeof rules];
            return (
              <p
                key={key}
                className={cn('flex items-center gap-1 font-inter font-medium text-text-secondary text-xs', {
                  'text-primary': isActive,
                })}
              >
                {isActive && (
                  // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path
                      d="M13.3334 4L6.00002 11.3333L2.66669 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {text}
              </p>
            );
          })}
        </div>

        {/* Предупреждение */}
        <p className="mt-2 font-inter font-medium text-text-secondary text-xs">
          Не применяйте частоиспользуемые пароли или же пароли совпадающие с логином или e-mail.
        </p>
      </div>
    </div>
  );
};
