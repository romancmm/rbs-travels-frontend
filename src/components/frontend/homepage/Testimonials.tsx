'use client'

import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { TestimonialsLoadingSkeleton } from '@/components/common/Skeleton'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { AnimatePresence, motion, PanInfo } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import TestimonialCard from './TestimonialCard'

interface Testimonial {
  id: number
  name: string
  location: string
  avatar?: string
  rating: number
  review: string
  tripType: string
  date: string
}

interface TestimonialsData {
  title: string
  subtitle: string
  testimonials: Testimonial[]
}

interface TestimonialsProps {
  data?: TestimonialsData
  isLoading?: boolean
  className?: string
}

const ITEMS_PER_PAGE = 3
const DRAG_THRESHOLD = 50

const Testimonials = ({ data, isLoading = false, className }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Safe data access
  const testimonials = data?.testimonials || []
  const maxIndex = Math.max(0, testimonials.length - ITEMS_PER_PAGE)
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + ITEMS_PER_PAGE)
  const hasMultiplePages = testimonials.length > ITEMS_PER_PAGE

  // Navigation functions
  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex]
  )

  // Drag handlers
  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      const { offset, velocity } = info
      const swipeThreshold = DRAG_THRESHOLD
      const swipeConfidenceThreshold = 10000
      const swipePower = Math.abs(offset.x) * velocity.x

      if (swipePower < -swipeConfidenceThreshold || offset.x < -swipeThreshold) {
        goToNext()
      } else if (swipePower > swipeConfidenceThreshold || offset.x > swipeThreshold) {
        goToPrev()
      }
    },
    [goToNext, goToPrev]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goToPrev()
      else if (event.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToNext, goToPrev])

  // Early returns for loading and empty states
  if (isLoading) return <TestimonialsLoadingSkeleton />
  if (!data?.testimonials?.length) {
    return (
      <Section variant='xl' className={className}>
        <Container>
          <EmptyState
            title='No Testimonials Available'
            description='Customer reviews will appear here once available.'
            imageSrc='/no-data.png'
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section variant='xl' className={cn('bg-gradient-to-b from-accent/5 to-background', className)}>
      <Container>
        {/* Header */}
        <Header data={data} />

        {/* Carousel */}
        <div className='relative'>
          {/* Navigation Buttons */}
          {hasMultiplePages && (
            <NavigationButtons
              onPrev={goToPrev}
              onNext={goToNext}
              canGoPrev={currentIndex > 0}
              canGoNext={currentIndex < maxIndex}
            />
          )}

          {/* Testimonials Grid with Drag Support */}
          <CarouselContainer
            currentIndex={currentIndex}
            direction={direction}
            onDragEnd={handleDragEnd}
            testimonials={visibleTestimonials}
            isDraggable={hasMultiplePages}
          />

          {/* Pagination */}
          {hasMultiplePages && (
            <PaginationDots
              currentIndex={currentIndex}
              totalPages={maxIndex + 1}
              onPageChange={goToIndex}
            />
          )}
        </div>
      </Container>
    </Section>
  )
}

// Header Component
const Header = ({ data }: { data: TestimonialsData }) => (
  <div className='mb-16 text-center'>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='space-y-4'
    >
      <div className='flex justify-center items-center gap-2 mb-3'>
        <Heart className='fill-red-500 w-5 h-5 text-red-500' />
        <Typography
          variant='subtitle1'
          className='font-semibold text-primary uppercase tracking-wide'
        >
          {data.subtitle}
        </Typography>
      </div>

      <Typography
        variant='h2'
        as='h2'
        weight='bold'
        className='mx-auto max-w-3xl text-foreground leading-tight'
      >
        {data.title}
      </Typography>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100px' }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className='bg-gradient-to-r from-red-400 via-primary to-accent mx-auto rounded-full h-1'
      />
    </motion.div>
  </div>
)

// Navigation Buttons Component
const NavigationButtons = ({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext
}: {
  onPrev: () => void
  onNext: () => void
  canGoPrev: boolean
  canGoNext: boolean
}) => (
  <>
    <NavigationButton
      direction='prev'
      onClick={onPrev}
      disabled={!canGoPrev}
      icon={<ChevronLeft className='w-5 h-5' />}
    />
    <NavigationButton
      direction='next'
      onClick={onNext}
      disabled={!canGoNext}
      icon={<ChevronRight className='w-5 h-5' />}
    />
  </>
)

// Individual Navigation Button
const NavigationButton = ({
  direction,
  onClick,
  disabled,
  icon
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
  icon: React.ReactNode
}) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'top-1/2 z-10 absolute -translate-y-1/2',
      direction === 'prev' ? '-left-6' : '-right-6',
      'w-12 h-12 rounded-full bg-card/90 backdrop-blur-sm',
      'border border-border/50 shadow-lg',
      'flex items-center justify-center',
      'transition-all duration-300',
      disabled
        ? 'opacity-30 cursor-not-allowed'
        : 'text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20'
    )}
  >
    {icon}
  </motion.button>
)

// Carousel Container with Drag Support
const CarouselContainer = ({
  currentIndex,
  direction,
  onDragEnd,
  testimonials,
  isDraggable
}: {
  currentIndex: number
  direction: number
  onDragEnd: (event: any, info: PanInfo) => void
  testimonials: Testimonial[]
  isDraggable: boolean
}) => {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className='relative rounded-2xl overflow-hidden'>
      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          drag={isDraggable ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(event, info) => {
            setIsDragging(false)
            onDragEnd(event, info)
          }}
          initial={{
            x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
            opacity: 0,
            scale: 0.98
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1
          }}
          exit={{
            x: direction > 0 ? '-100%' : direction < 0 ? '100%' : 0,
            opacity: 0,
            scale: 0.98
          }}
          transition={{
            type: 'tween',
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: isDragging ? 0 : 0.5,
            opacity: { duration: isDragging ? 0 : 0.3 },
            scale: { duration: isDragging ? 0 : 0.3 }
          }}
          className={cn(
            'gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            isDraggable && 'cursor-grab active:cursor-grabbing select-none',
            isDragging && 'scale-[0.99]'
          )}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Drag Indicator */}
      {isDraggable && (
        <div className='bottom-4 left-1/2 absolute flex gap-1 opacity-30 -translate-x-1/2 transform'>
          <div className='bg-primary rounded-full w-1 h-1'></div>
          <div className='bg-primary rounded-full w-1 h-1'></div>
          <div className='bg-primary rounded-full w-1 h-1'></div>
        </div>
      )}
    </div>
  )
}

// Pagination Dots Component
const PaginationDots = ({
  currentIndex,
  totalPages,
  onPageChange
}: {
  currentIndex: number
  totalPages: number
  onPageChange: (index: number) => void
}) => (
  <div className='flex justify-center gap-2 mt-12'>
    {Array.from({ length: totalPages }).map((_, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(index)}
        className={cn(
          'rounded-full w-3 h-3 transition-all duration-300',
          currentIndex === index
            ? 'bg-primary shadow-lg shadow-primary/50'
            : 'bg-muted-foreground/30 hover:bg-primary/50'
        )}
        aria-label={`Go to page ${index + 1}`}
      />
    ))}
  </div>
)

export default Testimonials
