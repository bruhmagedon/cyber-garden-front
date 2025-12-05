import type { HTMLAttributes } from 'react';
import { PasswordValidatorProgress } from '@/features/auth/ui/PasswordValidator/PasswordValidatorProgress';
import { cn } from '@/shared/utils';
import { passwordRules } from './data';

interface Props extends HTMLAttributes<HTMLDivElement> {
  password: string;
}

export const PasswordValidator = ({ password, className }: Props) => {
  const validatedRules = passwordRules.map((rule) => ({
    ...rule,
    isValid: rule.validator(password),
  }));

  const totalRules = validatedRules.length;
  const passedRules = validatedRules.filter((rule) => rule.isValid).length;
  const progress = Math.round((passedRules / totalRules) * 100);

  return (
    <div className="absolute bottom-[calc(100%+8px)] left-0">
      <div
        className={cn('relative w-72 rounded-lg border border-border bg-fill-primary p-3.5 pb-1', className)}
      >
        {/* треугольник снизу слева */}
        <div className="-bottom-2 absolute left-4 h-2 w-4 overflow-hidden">
          <div className="-top-2 relative h-3 w-3 rotate-45 border border-border bg-fill-primary" />
        </div>

        <p className="font-medium text-base-content-100 text-xs">Надежность пароля {progress}%</p>

        {/* value в процентах */}
        <PasswordValidatorProgress className="my-2" value={progress} />

        <p className="font-medium text-base-content-100 text-xs">Требования к паролю</p>

        <div className="mt-2 flex flex-col gap-0.5">
          {validatedRules.map((rule) => (
            <p
              key={rule.id}
              className={cn('flex items-center gap-1 font-medium text-gray-4 text-xs', {
                'text-primary': rule.isValid,
              })}
            >
              {rule.isValid && (
                <svg
                  className={cn('text-gray-4', {
                    'text-primary': rule.isValid,
                  })}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <title>Checkmark</title>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
              {rule.label}
            </p>
          ))}
        </div>

        <p className="mt-2 font-medium text-base-content-100 text-xs">
          Не применяйте частоиспользуемые пароли или же пароли совпадающие с логином или e-mail.
        </p>
      </div>
    </div>
  );
};
