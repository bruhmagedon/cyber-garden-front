import { Switch } from '@/shared/ui/Switch/Switch';

interface NotificationToggleProps {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Переключатель уведомления с лейблом и разделителем
 * Использует shadcn Switch с адаптацией под дизайн
 */
export const NotificationToggle = ({ label, checked, onChange }: NotificationToggleProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-base text-text-tertiary leading-normal">{label}</span>

        <Switch checked={checked} onCheckedChange={onChange} />
      </div>

      {/* Разделитель */}
      <div className="h-px bg-fill-quaternary" />
    </div>
  );
};
