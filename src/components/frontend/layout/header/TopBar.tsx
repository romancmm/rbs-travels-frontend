'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { useSiteConfig } from '@/components/providers/store-provider'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Mail, Phone, X } from 'lucide-react'
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

  if (!isVisible) return null

  return (
    <div className='relative bg-primary py-2 text-white'>
      <Container>
        <div className='flex justify-between items-center gap-4'>
          {/* Left side - Contact info */}
          <div className='hidden md:flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone className='w-3 h-3' />
              <CustomLink
                href={`tel:${siteConfig?.phone}`}
                className='hover:text-primary-foreground/80 transition-colors'
              >
                {siteConfig?.phone}
              </CustomLink>
            </div>
            <div className='flex items-center gap-2'>
              <Mail className='w-3 h-3' />
              <CustomLink
                href={`mailto:${siteConfig?.email}`}
                className='hover:text-primary-foreground/80 transition-colors'
              >
                {siteConfig?.email}
              </CustomLink>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-3 h-3' />
              <span>{siteConfig?.workingHours}</span>
            </div>
          </div>

          {/* Center - Animated Announcement */}
          <div className='flex flex-1 justify-center md:justify-end items-center h-6 overflow-hidden'>
            {promoTexts.length > 0 && (
              <AnimatePresence mode='wait'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut'
                  }}
                  className='absolute flex flex-wrap gap-x-1 max-sm:px-3'
                >
                  {promoTexts[currentIndex]?.split(' ').map((word, wordIndex) => (
                    <motion.span
                      key={`${currentIndex}-${wordIndex}`}
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.6,
                        delay: wordIndex * 0.1,
                        ease: 'easeOut'
                      }}
                      className='lg:font-medium text-xs md:text-sm whitespace-nowrap'
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Right side - Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className='top-1.5 right-2 absolute flex justify-center items-center hover:bg-white/20 rounded-full w-6 h-6 transition-colors'
            aria-label='Close announcement'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      </Container>
    </div>
  )
}
