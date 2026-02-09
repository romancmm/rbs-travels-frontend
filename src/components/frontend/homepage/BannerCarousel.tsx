'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import { buttonVariants } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { BannerType } from '@/lib/validations/schemas/homepageSettings'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface BannerCarouselProps {
  data: BannerType | undefined
}

const BannerCarousel = ({ data }: BannerCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track current slide and setup auto-play
  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', onSelect)

    // Auto-play functionality
    let interval: NodeJS.Timeout | null = null

    if (isAutoPlaying) {
      interval = setInterval(() => {
        if (api) {
          api.scrollNext()
        }
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
      api.off('select', onSelect)
    }
  }, [api, isAutoPlaying])

  // Handle mouse events for auto-play with debounce
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => {
    // Small delay before resuming auto-play to prevent immediate transition
    setTimeout(() => setIsAutoPlaying(true), 500)
  }

  return (
    <Section variant='none' className='relative w-full overflow-hidden'>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
          duration: 30
        }}
        className='w-full'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselContent>
          {data?.map((banner, index) => (
            <CarouselItem key={index}>
              <div
                className={cn(
                  'relative flex justify-start items-center w-screen',
                  'h-[calc(100vh-8rem)] lg:h-[calc(75vh)]',
                  'transition-all duration-1000 ease-out',
                  'overflow-hidden'
                )}
              >
                {/* Background Image */}
                <Image
                  src={banner.bgImage}
                  alt={banner.title || 'Banner image'}
                  fill
                  priority={index === 0}
                  quality={90}
                  className='object-cover object-center transition-transform duration-1000 ease-out'
                />

                {/* Enhanced overlay with gradient */}
                <div className='absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/50' />

                {/* Animated particles background */}
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse' />
                </div>

                {/* Content with enhanced animations */}
                <Container variant={'wide'}>
                  <motion.div
                    key={`banner-${index}`}
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.6, -0.05, 0.01, 0.99]
                    }}
                    className='z-10 relative bg-linear-to-r from-gray-900/30 to-transparent p-4 lg:px-6 rounded-lg max-w-xl text-white shadow-md __bg-gray-900/50'
                  >
                    {/* Subtitle with enhanced animation */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className='mb-3'
                    >
                      <span className='inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-1.5 border border-white/10 rounded-md font-semibold text-xs uppercase tracking-wider'>
                        {banner.subTitle}
                      </span>
                    </motion.div>

                    {/* Title with staggered letter animation */}
                    <motion.h1
                      className='mb-4 font-extrabold text-3xl md:text-4xl 2xl:text-5xl'
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      {banner.title}
                    </motion.h1>

                    {/* Description with typewriter effect */}
                    <motion.p
                      className='mb-8 text-gray-100 text-lg leading-relaxed'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      {banner.desc}
                    </motion.p>

                    {/* Enhanced buttons with hover effects */}
                    {banner.buttons && banner.buttons.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className='flex justify-start items-center gap-2 sm:gap-4'
                      >
                        {banner.buttons?.map((button, btnIndex) => (
                          <CustomLink
                            href={button.url}
                            key={btnIndex}
                            className={cn(
                              buttonVariants({
                                size: 'lg',
                                variant: btnIndex === 0 ? 'default' : 'outline'
                              }),
                              'group relative overflow-hidden transition-all duration-500',
                              'px-4 lg:px-6 py-2.5 lg:py-5 font-medium text-sm lg:text-base',
                              'hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full',
                              btnIndex === 0
                                ? 'bg-primary hover:bg-primary/90 text-white border-2 border-primary hover:border-primary/70 shadow-2xl hover:shadow-3xl hover:shadow-primary/30'
                                : 'bg-white/10 backdrop-blur-md border border-white/40 text-white hover:bg-white/20 hover:border-white/60 hover:text-white shadow-lg hover:shadow-xl hover:shadow-white/10'
                            )}
                          >
                            <span className='z-10 relative flex justify-center items-center gap-3'>
                              {button.title}
                            </span>
                            {/* Animated gradient overlay for primary */}
                            {btnIndex === 0 && (
                              <>
                                <div className='absolute inset-0 bg-linear-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                                <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform -translate-x-full group-hover:translate-x-full duration-700' />
                              </>
                            )}
                            {/* Glassmorphism for secondary */}
                            {btnIndex !== 0 && (
                              <div className='absolute inset-0 bg-linear-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300' />
                            )}
                          </CustomLink>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                </Container>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Enhanced navigation buttons */}
        <CarouselPrevious
          className={cn(
            'max-md:hidden left-0 md:left-10 bg-white/10 backdrop-blur-sm w-12 h-12',
            'border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:text-white',
            'transition-all duration-300 hover:scale-110'
          )}
        >
          <ChevronLeft className='w-6 h-6' />
        </CarouselPrevious>

        <CarouselNext
          className={cn(
            'max-md:hidden right-6 md:right-10 bg-white/10 backdrop-blur-sm w-12 h-12',
            'border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:text-white',
            'transition-all duration-300 hover:scale-110'
          )}
        >
          <ChevronRight className='w-6 h-6' />
        </CarouselNext>

        {/* Enhanced slide indicators */}
        <div className='bottom-8 left-1/2 absolute flex gap-3 -translate-x-1/2'>
          {data?.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'rounded-full w-2 h-2 transition-all duration-300',
                current === index
                  ? 'bg-white scale-125 shadow-lg w-4'
                  : 'bg-white/40 hover:bg-white/70 hover:scale-110'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </Section>
  )
}

export default BannerCarousel
