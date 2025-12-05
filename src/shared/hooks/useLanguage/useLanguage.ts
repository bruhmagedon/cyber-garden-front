import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, Language } from '@/shared/constants/language';

const LANGUAGE_STORAGE_KEY = 'app-language';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    // Пытаемся получить язык из localStorage
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && LANGUAGES.includes(stored as Language)) {
      return stored as Language;
    }
    // Иначе используем текущий язык i18n
    return (i18n.language as Language) || 'ru';
  });

  // Синхронизируем с i18n при монтировании
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, []);

  const changeLanguage = useCallback(
    (newLanguage: Language) => {
      // Меняем язык в i18n
      i18n.changeLanguage(newLanguage);
      // Сохраняем в localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      // Обновляем локальное состояние
      setLanguageState(newLanguage);
    },
    [i18n],
  );

  return {
    language,
    changeLanguage,
    t: i18n.t,
  };
};
