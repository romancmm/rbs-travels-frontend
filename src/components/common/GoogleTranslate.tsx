'use client'

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/config/languages'
import { useEffect } from 'react'

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (options: Record<string, unknown>, containerId: string): unknown
          InlineLayout: { SIMPLE: unknown }
        }
      }
    }
    googleTranslateElementInit?: () => void
  }
}

const SCRIPT_ID = 'google-translate-script'
const CONTAINER_ID = 'google_translate_element'

export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return

    window.googleTranslateElementInit = () => {
      if (!window.google) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: DEFAULT_LANGUAGE,
          includedLanguages: SUPPORTED_LANGUAGES.map((lang) => lang.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        CONTAINER_ID
      )
    }

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.body.appendChild(script)
  }, [])

  // Google mounts its widget UI into this node. It must stay laid out (not
  // display:none) or the script no-ops and never creates `.goog-te-combo` -
  // globals.css visually hides it instead, via clip + 1px size. aria-hidden
  // keeps its own "Select Language" gadget label out of assistive tech and
  // text extraction, since LanguageSwitcher is the real, labelled control.
  return <div id={CONTAINER_ID} aria-hidden='true' />
}
