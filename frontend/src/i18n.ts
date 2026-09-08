import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';

const savedLang = localStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLang;
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    try {
      localStorage.setItem('lang', lng);
    } catch (_) {}
  });
}

export default i18n;
