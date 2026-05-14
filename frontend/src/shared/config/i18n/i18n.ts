import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en'
import { ru } from './locales/ru'
import { DEFAULT_LANGUAGE, I18N_NAMESPACES, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from './types'

// eslint-disable-next-line import/no-named-as-default-member
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ru, en },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: [...I18N_NAMESPACES],
    defaultNS: 'common',
    fallbackNS: [...I18N_NAMESPACES],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
    debug: import.meta.env.DEV,
  })

export { i18n }
