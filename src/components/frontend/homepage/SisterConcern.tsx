'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { SisterConcernSettings } from '@/lib/validations/schemas/sisterConcernSettings'
import Autoplay from 'embla-carousel-autoplay'
import { Building, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SisterConcernProps {
  data?: SisterConcernSettings
  isLoading?: boolean
  className?: string
}

const SisterConcern = ({ data, isLoading = false, className }: SisterConcernProps) => {
  if (!data?.companies?.length) {
    return null
  }

  // Filter only active companies
  const activeCompanies = data.companies.filter((company) => company.isActive)

  if (!activeCompanies.length) {
    return null
  }

  return (
    <Section variant='xl' className={cn('bg-muted/30', className)}>
      <Container>
        <Header data={data} />
        <CarouselContainer companies={activeCompanies} />
      </Container>
    </Section>
  )
}

// Header
const Header = ({ data }: { data: SisterConcernSettings }) => (
  <div className='mb-12 text-center'>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='space-y-4'
    >
      {data.subtitle && (
        <Typography
          variant='subtitle1'
          className='font-semibold text-primary uppercase tracking-wide'
        >
          {data.subtitle}
        </Typography>
      )}

      {data.title && (
        <Typography
          variant='h2'
          as='h2'
          weight='bold'
          className='mx-auto max-w-3xl text-foreground leading-tight'
        >
          {data.title}
        </Typography>
      )}
    </motion.div>
  </div>
)

// Carousel Container
const CarouselContainer = ({ companies }: { companies: any[] }) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <div className='relative'>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: true,
            stopOnMouseEnter: true
          })
        ]}
        className='w-full'
      >
        <CarouselContent className='-ml-4'>
          {companies.map((company, index) => (
            <CarouselItem key={index} className='pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4'>
              <CompanyCard company={company} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className='max-md:hidden left-0 -translate-x-1/2' />
        <CarouselNext className='max-md:hidden right-0 translate-x-1/2' />
      </Carousel>

      {/* Dots indicator */}
      <div className='flex justify-center items-center gap-2 mt-8'>
        {companies.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'rounded-full w-2 h-2 transition-all duration-300',
              current === index
                ? 'bg-primary scale-125 w-8'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Company Card
const CompanyCard = ({ company, index }: { company: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='h-full'
    >
      {company.url ? (
        <Link
          href={company.url}
          target='_blank'
          rel='noopener noreferrer'
          className={cn(
            'group relative flex flex-col justify-center items-center bg-background hover:bg-accent/5 shadow-sm hover:shadow-lg p-8 border rounded-xl w-full h-full transition-all duration-300 cursor-pointer'
          )}
        >
          <CardContent company={company} />
        </Link>
      ) : (
        <div
          className={cn(
            'group relative flex flex-col justify-center items-center bg-background hover:bg-accent/5 shadow-sm hover:shadow-lg p-8 border rounded-xl w-full h-full transition-all duration-300'
          )}
        >
          <CardContent company={company} />
        </div>
      )}
    </motion.div>
  )
}

// Card Content Component
const CardContent = ({ company }: { company: any }) => {
  return (
    <>
      {/* Logo Container */}
      <div className='relative flex justify-center items-center mb-4 rounded-lg w-full h-32 overflow-hidden'>
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name || 'Company logo'}
            fill
            className='p-4 object-contain group-hover:scale-110 transition-transform duration-300'
          />
        ) : (
          <Building className='w-16 h-16 text-muted-foreground' />
        )}
      </div>

      {/* Company Name */}
      {company.name && (
        <Typography
          variant='h6'
          as='h3'
          weight='semibold'
          className='mb-2 text-foreground group-hover:text-primary text-center transition-colors'
        >
          {company.name}
        </Typography>
      )}

      {/* Description */}
      {company.description && (
        <Typography variant='body2' className='text-muted-foreground text-center line-clamp-2'>
          {company.description}
        </Typography>
      )}

      {/* External Link Icon */}
      {company.url && (
        <div className='top-4 right-4 absolute opacity-0 group-hover:opacity-100 transition-opacity'>
          <ExternalLink className='w-4 h-4 text-primary' />
        </div>
      )}
    </>
  )
}

export default SisterConcern
