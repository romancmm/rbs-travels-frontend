'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface LinkRedirectProps {
  url: string
  target?: '_self' | '_blank' | null
}

/**
 * Sends the visitor on to a `custom-link` / `external-link` menu item's
 * destination. Navigation is a side effect, so it belongs in an effect
 * (not the component body) — doing it during render re-fires on every
 * re-render (e.g. SWR revalidation) and can open duplicate tabs.
 */
export function LinkRedirect({ url, target }: LinkRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer')
      router.back()
    } else {
      router.replace(url)
    }
  }, [url, target, router])

  return null
}
