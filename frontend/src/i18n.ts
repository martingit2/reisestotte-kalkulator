import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en.json';
import translationNO from './locales/no.json';

const resources = {
  en: {
    translation: translationEN,
  },
  no: {
    translation: translationNO,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'no',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;