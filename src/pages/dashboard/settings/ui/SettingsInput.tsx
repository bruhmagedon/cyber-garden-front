import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { cn } from '@/shared/utils';

interface SettingsInputProps {
  label: string;
  helpText?: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: 'text' | 'email';
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Кастомный инпут для страницы настроек
 * Включает лейбл и опциональный текст помощи
 */
export const SettingsInput = ({
  label,
  helpText,
  value,
  placeholder,
  readOnly = false,
  type = 'text',
  className,
  onChange,
}: SettingsInputProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Лейбл и текст помощи */}
      <div className="flex items-start justify-between gap-3">
        {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
        <label className="flex items-center gap-2">
          <span className="font-medium text-sm text-text-tertiary leading-tight">{label}</span>
        </label>

        {/* Текст помощи - только на десктопе */}
        {helpText && (
          <Button variant="link" className="hidden h-auto p-0 font-semibold text-sm lg:flex">
            {helpText}
          </Button>
        )}
      </div>

      {/* Поле ввода */}
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        // variant="settings"
        onChange={onChange}
      />
    </div>
  );
};
