'use client'

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  getLanguage,
  isSupportedLanguage
} from '@/config/languages'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

type LanguageContextType = {
  language: string
  setLanguage: (code: string) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

function applyDocumentLangAttrs(code: string) {
  const meta = getLanguage(code)
  document.documentElement.lang = code
  document.documentElement.dir = meta.dir === 'rtl' ? 'rtl' : 'ltr'
}

// Google Translate reads this cookie on load and keeps it in sync with the
// hidden `.goog-te-combo` select it injects once its script has initialized.
function triggerGoogleTranslate(code: string): boolean {
  const value = `/en/${code}`
  const hostname = window.location.hostname

  // Google's widget persists its own copy of this cookie, and the Domain
  // attribute it uses can differ from the host-only cookie js-cookie sets by
  // default - once that happens, Google's copy silently shadows ours and
  // every later switch appears stuck on whatever language was first picked.
  // Writing both the host-only and the dot-prefixed apex-domain variant to
  // the same value guarantees ours wins regardless of which one it reads.
  Cookies.set('googtrans', value, { path: '/' })
  if (hostname && hostname !== 'localhost') {
    Cookies.set('googtrans', value, { path: '/', domain: `.${hostname}` })
  }

  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (combo) {
    combo.value = code
    combo.dispatchEvent(new Event('change'))
    return true
  }

  // Widget script hasn't finished initializing yet - reload so it picks up
  // the cookie we just set during its own bootstrap.
  window.location.reload()
  return false
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE)

  useEffect(() => {
    const cookieValue = Cookies.get(LANGUAGE_COOKIE)
    const initial = isSupportedLanguage(cookieValue) ? cookieValue : DEFAULT_LANGUAGE
    setLanguageState(initial)
    applyDocumentLangAttrs(initial)
  }, [])

  const setLanguage = (code: string) => {
    if (!isSupportedLanguage(code) || code === language) return

    Cookies.set(LANGUAGE_COOKIE, code, { expires: 365 })
    setLanguageState(code)
    applyDocumentLangAttrs(code)

    // Only ask the server to re-render with the new `lang` param when we're
    // not about to hard-reload from triggerGoogleTranslate already.
    if (triggerGoogleTranslate(code)) {
      router.refresh()
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
