'use client'

import CarouselWrapper from '@/components/common/carousel-wrapper'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { TopCountriesType, type DestinationItem } from '@/lib/validations/schemas/homepageSettings'
import { ArrowLeft, ArrowRight, Briefcase, DollarSign, Users } from 'lucide-react'
import { useState } from 'react'

const DestinationCard = ({
  destination,
  index
}: {
  destination: DestinationItem
  index: number
}) => {
  return (
    <div
      className='group relative bg-card shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden transition-all hover:-translate-y-2 duration-700'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className='relative aspect-square overflow-hidden'>
        <CustomImage
          src={destination.image || ''}
          alt={destination.name || 'Destination'}
          width={400}
          height={300}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
        />

        {/* Dynamic overlay gradient */}
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent' />
      </div>

      {/* Content */}
      <div className='space-y-4 p-5'>
        {/* Title and Description */}
        <div className='space-y-2'>
          <Typography
            variant='subtitle1'
            weight='semibold'
            className='text-foreground group-hover:text-primary line-clamp-1 transition-colors'
          >
            {destination.name}
          </Typography>
          <Typography
            variant='body2'
            className='text-muted-foreground line-clamp-2 leading-relaxed'
          >
            {destination.description}
          </Typography>
        </div>

        {/* Metadata with enhanced styling */}
        <div className='space-y-2 pt-2 border-border border-t'>
          {destination.workers && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Users className='w-4 h-4 text-primary' />
              <span className='font-medium text-sm'>{destination.workers} Workers</span>
            </div>
          )}
          {destination.averageSalary && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <DollarSign className='w-4 h-4 text-primary' />
              <span className='font-medium text-sm'>{destination.averageSalary}</span>
            </div>
          )}
          {destination.visaType && (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Briefcase className='w-4 h-4 text-primary' />
              <span className='font-medium text-sm'>{destination.visaType}</span>
            </div>
          )}
        </div>

        {/* Top Sectors */}
        {destination.topSectors && destination.topSectors.length > 0 && (
          <div className='pt-2'>
            <Typography variant='body2' weight='medium' className='mb-2 text-foreground/80'>
              Top Sectors:
            </Typography>
            <div className='flex flex-wrap gap-2'>
              {destination.topSectors.slice(0, 3).map((sector, idx) => (
                <span
                  key={idx}
                  className='bg-primary/10 px-2 py-1 rounded-full font-medium text-primary text-xs'
                >
                  {sector}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TopDestinations({ data }: { data?: TopCountriesType }) {
  // CarouselWrapper owns the embla instance internally - this mirrors it back
  // up so the header row above the rail (slide counter + prev/next buttons)
  // can drive the same carousel instead of duplicating carousel plumbing.
  const [carouselState, setCarouselState] = useState<{
    api: CarouselApi
    current: number
    count: number
  }>()

  const api = carouselState?.api
  const current = carouselState?.current ?? 0
  const count = carouselState?.count ?? 0
  const canScrollPrev = !!api?.canScrollPrev()
  const canScrollNext = !!api?.canScrollNext()

  if (!data?.destinations?.length) return null

  return (
    <Section
      variant={'md'}
      className={cn(
        'relative bg-linear-to-br from-primary/5 via-background to-accent/5 overflow-hidden'
      )}
    >
      {/* Enhanced Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <Container className='relative'>
        <SectionHeading
          subtitle={data.subtitle || 'Top Destinations'}
          title={data.title || 'Explore Top Countries'}
          description="Discover the world's most breathtaking destinations with our curated collection of extraordinary travel experiences."
          variant='badge'
          alignment='center'
        />

        {/* Rail header row: slide counter + prev/next, driven by the carousel below via onApiChange */}
        <div className='relative mb-8'>
          <CarouselWrapper
            loop
            showArrows={false}
            showDots={false}
            itemsPerView={{ default: 1, sm: 2, lg: 3, xl: 4 }}
            contentClassName='pt-6 pb-10'
            onApiChange={setCarouselState}
          >
            {data.destinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} index={index} />
            ))}
          </CarouselWrapper>

          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-4'>
              {/* <div className='hidden md:flex items-center gap-2 text-muted-foreground text-sm'>
                <Filter className='w-4 h-4' />
                <span>{data.destinations.length} destinations</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                <span>
                  {count > 0 ? current + 1 : 0} of {count} slides
                </span>
              </div> */}
            </div>

            <div className='flex items-center gap-3'>
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
                <ArrowLeft />
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
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className='flex justify-center items-center gap-2 -mt-6 mb-8'>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'rounded-full h-2 transition-all duration-300',
                index === current ? 'bg-primary w-8' : 'bg-border hover:bg-muted-foreground/50 w-2'
              )}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}
