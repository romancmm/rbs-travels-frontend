'use client'

import { Section } from '@/components/common/section'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface Banner {
  id: number
  title: string
  subtitle: string
  description: string
  button: string
  image: string
}

interface BannerCarouselProps {
  banners: Banner[]
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
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

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })

    // Auto-play functionality
    const interval = setInterval(() => {
      if (isAutoPlaying && api) {
        api.scrollNext()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [api, isAutoPlaying])

  // Handle mouse events for auto-play
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

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
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div
                className={cn(
                  'relative flex justify-center items-center w-screen',
                  'bg-cover bg-no-repeat bg-center',
                  'h-[90vh] sm:h-[85vh] md:h-[calc(100vh-6rem)] 2xl:h-screen',
                  'transition-all duration-1000 ease-out',
                  '-mx-4 sm:-mx-6 md:-mx-8'
                )}
                style={{
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundAttachment: isMobile ? 'scroll' : 'fixed',
                  transform: current === index ? 'scale(1)' : 'scale(1.02)',
                  marginLeft: 'calc(-50vw + 50%)',
                  marginRight: 'calc(-50vw + 50%)'
                }}
              >
                {/* Enhanced overlay with gradient */}
                <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70' />

                {/* Animated particles background */}
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse' />
                </div>

                {/* Content with enhanced animations */}
                <AnimatePresence mode='wait'>
                  {current === index && (
                    <motion.div
                      key={`banner-${banner.id}`}
                      initial={{ opacity: 0, y: 60, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 1.1 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.6, -0.05, 0.01, 0.99]
                      }}
                      className='z-10 relative mx-auto px-2 lg:px-6 max-w-4xl text-white text-center'
                    >
                      {/* Subtitle with enhanced animation */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className='mb-3'
                      >
                        <span className='inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-1.5 border border-white/20 rounded-full font-semibold text-xs md:text-sm uppercase tracking-wider'>
                          {banner.subtitle}
                        </span>
                      </motion.div>

                      {/* Title with staggered letter animation */}
                      <motion.h1
                        className='mb-4 font-bold text-4xl md:text-7xl 2xl:text-8xl'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        {banner.title}
                      </motion.h1>

                      {/* Description with typewriter effect */}
                      <motion.p
                        className='mx-auto mb-8 max-w-2xl text-gray-100 text-lg md:text-xl leading-relaxed'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        {banner.description}
                      </motion.p>

                      {/* Enhanced buttons with hover effects */}
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className='flex justify-center items-center gap-3 sm:gap-6'
                      >
                        {/* Primary CTA Button */}
                        <Button
                          size='lg'
                          className={cn(
                            'group relative bg-primary hover:bg-primary/90 overflow-hidden',
                            'px-8 lg:px-10 py-2.5 lg:py-5 text-white font-medium text-sm lg:text-base transition-all duration-500',
                            'border-2 border-primary hover:border-primary/70',
                            'shadow-2xl hover:shadow-3xl hover:shadow-primary/30',
                            'hover:scale-105 hover:-translate-y-1 active:scale-95 rounded-full'
                          )}
                        >
                          <span className='z-10 relative flex justify-center items-center gap-3'>
                            {banner.button}
                          </span>
                          {/* Animated gradient overlay */}
                          <div className='absolute inset-0 bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                          {/* Shine effect */}
                          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform -translate-x-full group-hover:translate-x-full duration-700' />
                        </Button>

                        {/* Secondary Button */}
                        <Button
                          variant='outline'
                          size='lg'
                          className={cn(
                            'group relative bg-white/10 backdrop-blur-md border border-white/40 text-white',
                            'hover:bg-white/20 hover:border-white/60 hover:text-white transition-all duration-500',
                            'px-8 lg:px-10 py-2.5 lg:py-5 font-medium text-sm lg:text-base',
                            'hover:scale-105 hover:-translate-y-1 active:scale-95',
                            'rounded-full shadow-lg hover:shadow-xl hover:shadow-white/10'
                          )}
                        >
                          Learn More
                          {/* Glassmorphism background */}
                          <div className='absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300' />
                        </Button>
                      </motion.div>

                      {/* Additional Action Elements */}
                      {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        className='flex sm:flex-row flex-col justify-center items-center gap-6 mt-8 text-white/80'
                      >
                        <div className='flex items-center gap-2 text-sm'>
                          <motion.div
                            className='flex justify-center border-2 border-white/40 rounded-full w-6 h-10'
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <motion.div
                              className='bg-white mt-2 rounded-full w-1 h-3'
                              animate={{ y: [0, 12, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          </motion.div>
                          <span className='hidden sm:inline'>Scroll to explore</span>
                        </div>

                        <div className='flex items-center gap-2 text-sm'>
                          <div className='flex -space-x-2'>
                            <div className='bg-gradient-to-r from-primary to-primary/70 border-2 border-white rounded-full w-8 h-8' />
                            <div className='bg-gradient-to-r from-purple-500 to-purple-700 border-2 border-white rounded-full w-8 h-8' />
                            <div className='bg-gradient-to-r from-green-500 to-green-700 border-2 border-white rounded-full w-8 h-8' />
                          </div>
                          <span className='hidden sm:inline'>Join 10,000+ happy travelers</span>
                        </div>
                      </motion.div> */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Enhanced navigation buttons */}
        <CarouselPrevious
          className={cn(
            'left-6 md:left-10 bg-white/10 backdrop-blur-sm w-12 h-12',
            'border-white/20 text-white hover:bg-white/20 hover:border-white/40',
            'transition-all duration-300 hover:scale-110'
          )}
        >
          <ChevronLeft className='w-6 h-6' />
        </CarouselPrevious>

        <CarouselNext
          className={cn(
            'right-6 md:right-10 bg-white/10 backdrop-blur-sm w-12 h-12',
            'border-white/20 text-white hover:bg-white/20 hover:border-white/40',
            'transition-all duration-300 hover:scale-110'
          )}
        >
          <ChevronRight className='w-6 h-6' />
        </CarouselNext>

        {/* Enhanced slide indicators */}
        <div className='bottom-8 left-1/2 absolute flex gap-3 -translate-x-1/2'>
          {banners.map((_, index) => (
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

        {/* Progress bar */}
        <div className='bottom-0 left-0 absolute bg-white/20 w-full h-1'>
          <motion.div
            className='bg-primary h-full'
            initial={{ width: '0%' }}
            animate={{
              width:
                current === banners.length - 1
                  ? '100%'
                  : `${((current + 1) / banners.length) * 100}%`
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Carousel>
    </Section>
  )
}

export default BannerCarousel
