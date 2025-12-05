import { Eye, EyeClosed } from 'lucide-react';
import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { Input } from '@/shared/ui';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

/**
 * Инпут для пароля с переключателем видимости
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative flex w-full items-center">
        <Input ref={ref} type={showPassword ? 'text' : 'password'} className={className} {...props} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 flex h-6 w-6 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:text-text-tertiary"
        >
          {showPassword ? (
            <Eye className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <EyeClosed className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
