export type SupportedLanguage = 'en' | 'fa'
export const RTL_LANGUAGES: SupportedLanguage[] = ['fa']

export function isRtl(language: string): boolean {
  return RTL_LANGUAGES.includes(language as SupportedLanguage)
}

export function setDocumentLanguage(language: SupportedLanguage): void {
  const root = document.documentElement
  root.lang = language
  root.dir = isRtl(language) ? 'rtl' : 'ltr'
}
