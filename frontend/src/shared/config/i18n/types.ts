export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'ru'

export const LANGUAGE_STORAGE_KEY = 'app-language'

export const I18N_NAMESPACES = ['common', 'auth', 'workspace', 'board', 'landing', 'errors', 'validation'] as const

export type I18nNamespace = (typeof I18N_NAMESPACES)[number]

export function isLanguage(value: string): value is Language {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
}
