'use client'

import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { TestimonialsLoadingSkeleton } from '@/components/common/Skeleton'
import { Typography } from '@/components/common/typography'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
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

const Testimonials = ({ data, isLoading = false, className }: TestimonialsProps) => {
  if (isLoading) return <TestimonialsLoadingSkeleton />

  if (!data?.testimonials?.length) {
    return (
      <Section variant="xl" className={className}>
        <Container>
          <EmptyState
            title="No Testimonials Available"
            description="Customer reviews will appear here once available."
            imageSrc="/no-data.png"
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section variant="xl" className={cn('bg-linear-to-b from-accent/5 to-background', className)}>
      <Container>
        <Header data={data} />
        <CarouselContainer testimonials={data.testimonials} />
      </Container>
    </Section>
  )
}

// Header
const Header = ({ data }: { data: TestimonialsData }) => (
  <div className="mb-10 text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <Typography
        variant="subtitle1"
        className="font-semibold text-primary uppercase tracking-wide"
      >
        {data.subtitle}
      </Typography>

      <Typography
        variant="h2"
        as="h2"
        weight="bold"
        className="mx-auto max-w-3xl text-foreground leading-tight"
      >
        {data.title}
      </Typography>
    </motion.div>
  </div>
)

// Carousel Container with arrows + dots + lifted middle card
const CarouselContainer = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000
          }),
        ]}
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
          containScroll: 'trimSnaps',
        }}
      >
        <CarouselContent className="-ml-4 sm:-ml-6 pt-6 pb-6">
          {testimonials.map((testimonial, index) => {
            return (
              <CarouselItem
                key={testimonial.id}
                className={cn(
                  'pl-4 sm:pl-6 transition-all duration-500',
                  'basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3',
                  { '-mt-4': index === current }
                )}
              >
                <TestimonialCard testimonial={testimonial} index={index} />
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {/* Arrows */}
        <CarouselPrevious className="top-1/2 -left-4 z-10 absolute bg-background/80 hover:bg-background shadow-md text-foreground -translate-y-1/2" />
        <CarouselNext className="top-1/2 -right-4 z-10 absolute bg-background/80 hover:bg-background shadow-md text-foreground -translate-y-1/2" />
      </Carousel>

      {/* Dots */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'rounded-full w-2 h-2 transition-all duration-300',
                index === current
                  ? 'bg-primary w-4'
                  : 'bg-muted hover:bg-primary/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Testimonials
