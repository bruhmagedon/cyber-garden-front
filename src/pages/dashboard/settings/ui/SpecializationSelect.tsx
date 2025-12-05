import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select/Select';

interface SpecializationSelectProps {
  value: string;
  onChange?: (value: string) => void;
}

// Список специализаций
const specializationKeys = [
  'project-manager',
  'developer',
  'designer',
  'analyst',
  'qa',
  'product-owner',
  'scrum-master',
  'other',
];

/**
 * Выпадающий список для выбора специализации
 * Использует Select из shadcn/ui с адаптацией под дизайн
 */
export const SpecializationSelect = ({ value, onChange }: SpecializationSelectProps) => {
  const { t } = useTranslation('settings');

  return (
    <div className="flex flex-col gap-3">
      {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
      <label className="flex items-center gap-2">
        <span className="font-medium text-sm text-text-tertiary leading-tight lg:font-semibold lg:text-text-primary">
          {t('sections.profile.specialization_label')}
        </span>
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {specializationKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {t(`specializations.${key}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
