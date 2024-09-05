// utils/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/tran.json';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next.
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if the key is not present in the selected language
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;

