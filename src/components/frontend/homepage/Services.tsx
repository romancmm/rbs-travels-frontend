'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { ServicesType, type ServiceItem } from '@/lib/validations/schemas/homepageSettings'
import { useCallback, useEffect, useState } from 'react'

const ServiceCard = ({ service, index }: { service: ServiceItem; index: number }) => {
  return (
    <div
      className='group relative bg-white shadow-md hover:shadow-xl rounded-3xl overflow-hidden transition-all hover:-translate-y-2 duration-700'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className='relative aspect-video overflow-hidden'>
        <CustomImage
          src={service.image || ''}
          alt={service.name || 'Service'}
          width={400}
          height={300}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
        />

        {/* Dynamic overlay gradient */}
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
      </div>

      {/* Content */}
      <div className='bottom-0 absolute bg-linear-to-t from-gray-800 to-transparent p-5 w-full'>
        <Typography
          href={service.url ?? '#'}
          variant='subtitle1'
          weight='semibold'
          className='text-gray-100 line-clamp-1 transition-colors'
        >
          {service.name}
        </Typography>
        <Typography variant='body2' className='text-gray-300 line-clamp-2 leading-relaxed'>
          {service.description}
        </Typography>
      </div>
    </div>
  )
}

export default function Services({ data }: { data?: ServicesType }) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return

    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return

    onSelect(api)

    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
      api?.off('reInit', onSelect)
    }
  }, [api, onSelect])

  if (!data?.services?.length) return null

  return (
    <Section
      variant={'xl'}
      className={cn(
        'relative bg-linear-to-br from-blue-50/50 via-white to-purple-50/30 overflow-hidden'
      )}
    >
      <Container className='relative'>
        <Carousel
          setApi={setApi}
          className='w-full'
          opts={{
            align: 'start',
            loop: true,
            // skipSnaps: false,
            // dragFree: true,
            // containScroll: 'trimSnaps',
            slidesToScroll: 'auto'
          }}
          // plugins={[autoplayPlugin, classNamesPlugin]}
        >
          <CarouselContent className='-ml-6 pt-6 pb-10'>
            {data?.services.map((service, index) => (
              <CarouselItem key={index} className='pl-6 basis-1/1 sm:basis-1/2'>
                <ServiceCard service={service} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className='right-4 -bottom-2 z-10 absolute flex justify-end items-center gap-4'>
            <CarouselPrevious
              className={cn(
                'static hover:bg-primary border-gray-200 hover:border-primary hover:text-white transition-all translate-x-0 translate-y-0 duration-300',
                !canScrollPrev && 'opacity-50 cursor-not-allowed'
              )}
            />
            <CarouselNext
              className={cn(
                'static hover:bg-primary border-gray-200 hover:border-primary hover:text-white transition-all translate-x-0 translate-y-0 duration-300',
                !canScrollNext && 'opacity-50 cursor-not-allowed'
              )}
            />
          </div>
        </Carousel>
      </Container>
    </Section>
  )
}
