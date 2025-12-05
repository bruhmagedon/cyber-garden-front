import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.VITE_APP_DEBUG_I18 === 'true',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    load: 'currentOnly',
    // Namespaces, которые должны быть загружены при инициализации
    ns: ['notifications', 'cookie-consent', 'translation'],
    backend: {
      // Загрузка переводов необходимыми частями
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // interpolation: {
    //   escapeValue: false, // чтобы HTML-символы, как &nbsp;, правильно обрабатывались
    // },
  });

export default i18n;
