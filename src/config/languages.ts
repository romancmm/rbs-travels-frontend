export interface SupportedLanguage {
  code: string
  name: string
  nativeName: string
  dir?: 'rtl'
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
]

export const DEFAULT_LANGUAGE = 'en'

export const LANGUAGE_COOKIE = 'site_lang'

export const isSupportedLanguage = (code: string | undefined | null): code is string =>
  !!code && SUPPORTED_LANGUAGES.some((lang) => lang.code === code)

export const getLanguage = (code: string | undefined | null): SupportedLanguage =>
  SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ?? SUPPORTED_LANGUAGES[0]
