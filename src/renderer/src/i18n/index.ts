import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/common.json'
import fa from './locales/fa/common.json'

export type { SupportedLanguage } from './rtl'
export { RTL_LANGUAGES, isRtl, setDocumentLanguage } from './rtl'

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      fa: { common: fa }
    },
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnNull: false,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (languages, _ns, key) => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] Missing translation key "${key}" for language(s): ${languages.join(', ')}`)
      }
    }
  })

export default i18n
