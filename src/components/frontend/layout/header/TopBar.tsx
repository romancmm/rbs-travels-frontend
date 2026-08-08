'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import SocialLinks from '@/components/common/SocialLinks'
import { useSiteConfig } from '@/components/providers/store-provider'
import { Clock, Mail, Phone, Sparkles, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { siteConfig } = useSiteConfig()

  const promoTexts = siteConfig?.promoText || []

  useEffect(() => {
    if (promoTexts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoTexts.length)
    }, 4000) // Change text every 4 seconds

    return () => clearInterval(interval)
  }, [promoTexts.length])

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='relative bg-primary border-white/10 border-b overflow-hidden text-white'
        >
          <Container>
            <div className='flex items-center justify-between gap-4 py-2 text-xs sm:text-sm'>
              {/* Left - Contact info */}
              <div className='hidden lg:flex items-center gap-4 shrink-0'>
                <CustomLink
                  href={`tel:${siteConfig?.phone}`}
                  className='flex items-center gap-1.5 opacity-90 hover:opacity-100 font-medium transition-opacity'
                >
                  <Phone className='w-3.5 h-3.5' />
                  {siteConfig?.phone}
                </CustomLink>
                <span className='bg-white/25 w-px h-3.5' />
                <CustomLink
                  href={`mailto:${siteConfig?.email}`}
                  className='flex items-center gap-1.5 opacity-90 hover:opacity-100 font-medium transition-opacity'
                >
                  <Mail className='w-3.5 h-3.5' />
                  {siteConfig?.email}
                </CustomLink>
                {siteConfig?.workingHours && (
                  <>
                    <span className='bg-white/25 w-px h-3.5' />
                    <span className='flex items-center gap-1.5 opacity-90 font-medium'>
                      <Clock className='w-3.5 h-3.5' />
                      {siteConfig.workingHours}
                    </span>
                  </>
                )}
              </div>

              {/* Center - Announcement */}
              <div className='relative flex flex-1 justify-center items-center h-5 min-w-0 overflow-hidden'>
                {promoTexts.length > 0 && (
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className='absolute flex items-center gap-1.5 px-3 max-w-full font-medium whitespace-nowrap'
                    >
                      <Sparkles className='w-3.5 h-3.5 shrink-0' />
                      <span className='truncate'>{promoTexts[currentIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Right - Social links + dismiss */}
              <div className='flex items-center gap-3 shrink-0'>
                <div className='hidden sm:block'>
                  <SocialLinks size='sm' />
                </div>

                <button
                  type='button'
                  onClick={() => setIsVisible(false)}
                  className='flex justify-center items-center hover:bg-white/15 rounded-full size-6 transition-colors'
                  aria-label='Dismiss announcement bar'
                >
                  <X className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
