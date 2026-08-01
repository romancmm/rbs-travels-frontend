'use client'

import CarouselWrapper from '@/components/common/carousel-wrapper'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { ServicesType, type ServiceItem } from '@/lib/validations/schemas/homepageSettings'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const ServiceCard = ({ service, index }: { service: ServiceItem; index: number }) => {
  return (
    <div
      className='group relative bg-card shadow-md hover:shadow-xl rounded-lg overflow-hidden transition-all hover:-translate-y-2 duration-700'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className='relative aspect-video overflow-hidden'>
        <CustomImage
          src={service.image || ''}
          alt={service.name || 'Service'}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
        />

        {/* Dynamic overlay gradient */}
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
      </div>

      {/* Content */}
      <div className='bottom-0 absolute space-y-2 bg-linear-to-t from-black/90 to-transparent p-5 w-full'>
        <Typography
          href={service.url ?? '#'}
          variant='h4'
          weight='bold'
          className='text-gray-100 group-hover:text-white line-clamp-1 transition-colors'
        >
          {service.name}
        </Typography>
        <Typography
          variant='body1'
          weight='medium'
          className='text-gray-300 line-clamp-2 leading-relaxed'
        >
          {service.description}
        </Typography>
      </div>
    </div>
  )
}

export default function Services({ data }: { data?: ServicesType }) {
  // CarouselWrapper owns the embla instance internally - this mirrors it back
  // up so the prev/next buttons anchored bottom-right can drive the same
  // carousel instead of duplicating carousel plumbing.
  const [carouselState, setCarouselState] = useState<{
    api: CarouselApi
    current: number
    count: number
  }>()

  const api = carouselState?.api
  const canScrollPrev = !!api?.canScrollPrev()
  const canScrollNext = !!api?.canScrollNext()

  if (!data?.services?.length) return null

  return (
    <Section variant={'md'} className={cn('relative overflow-hidden')}>
      <Container className='relative'>
        <CarouselWrapper
          loop
          showArrows={false}
          showDots={false}
          itemsPerView={{ default: 1, sm: 1.75 }}
          contentClassName='pt-6 pb-10'
          onApiChange={setCarouselState}
        >
          {data.services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </CarouselWrapper>

        <div className='-bottom-2 z-10 absolute inset-e-4 flex justify-end items-center gap-4'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className={cn(
              'hover:bg-primary border-border hover:border-primary hover:text-white transition-all duration-300',
              !canScrollPrev && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowLeft className='rtl:rotate-180' />
          </Button>
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className={cn(
              'hover:bg-primary border-border hover:border-primary hover:text-white transition-all duration-300',
              !canScrollNext && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowRight className='rtl:rotate-180' />
          </Button>
        </div>
      </Container>
    </Section>
  )
}
