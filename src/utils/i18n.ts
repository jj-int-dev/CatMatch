import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '../config/locales/en-translation.json';
import esTranslation from '../config/locales/es-translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    fallbackLng: 'en', // Fallback language if a translation is missing
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
