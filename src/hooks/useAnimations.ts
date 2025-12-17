'use client'

import { useEffect, useRef } from 'react'

/**
 * Hook for intersection observer based animations
 * Triggers animations when element enters viewport
 */
export const useInViewAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('animate-in-view')
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold])

  return ref
}

/**
 * Hook for staggered animations on child elements
 */
export const useStaggeredAnimation = (delay = 100) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const children = element.children
    Array.from(children).forEach((child, index) => {
      const htmlChild = child as HTMLElement
      htmlChild.style.animationDelay = `${index * delay}ms`
      htmlChild.style.animationFillMode = 'both'
    })
  }, [delay])

  return ref
}
