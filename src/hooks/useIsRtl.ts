'use client'

import { useEffect, useState } from 'react'

const readIsRtl = () => typeof document !== 'undefined' && document.documentElement.dir === 'rtl'

/**
 * Tracks the page's text direction reactively. `LanguageProvider` flips
 * `document.documentElement.dir` client-side (no guaranteed full reload), so
 * consumers that need to react to a language switch - like re-initializing an
 * Embla carousel with the correct `direction` - can't just read `dir` once on
 * mount; a MutationObserver is the only way to see that change live.
 */
export function useIsRtl(): boolean {
  const [isRtl, setIsRtl] = useState(readIsRtl)

  useEffect(() => {
    setIsRtl(readIsRtl())

    const observer = new MutationObserver(() => setIsRtl(readIsRtl()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] })

    return () => observer.disconnect()
  }, [])

  return isRtl
}
