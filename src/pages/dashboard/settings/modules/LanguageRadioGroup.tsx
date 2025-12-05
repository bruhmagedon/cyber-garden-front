import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/RadioGroup/RadioGroup';

type Language = 'ru' | 'en';

interface LanguageOption {
  value: Language;
  labelKey: string;
}

interface LanguageRadioGroupProps {
  value: Language;
  onChange?: (value: Language) => void;
}

/**
 * Группа радио-кнопок для выбора языка
 * Использует shadcn RadioGroup с кастомной стилизацией
 */
export const LanguageRadioGroup = ({ value, onChange }: LanguageRadioGroupProps) => {
  const { t } = useTranslation('settings');

  const languages: LanguageOption[] = [
    { value: 'ru', labelKey: 'sections.language.options.ru' },
    { value: 'en', labelKey: 'sections.language.options.en' },
  ];

  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-6">
      {languages.map((lang) => (
        // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
        <label key={lang.value} className="flex cursor-pointer items-center gap-3">
          <RadioGroupItem value={lang.value} />
          <span className="font-medium text-sm text-text-tertiary leading-tight lg:text-base lg:leading-normal">
            {t(lang.labelKey)}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
};
