import 'i18next';
import { Language } from '@shared/constants/language';

declare module 'i18next' {
  interface i18n {
    language: Language;
  }
}
