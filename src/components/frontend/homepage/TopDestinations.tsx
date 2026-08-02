'use client'

import CarouselWrapper from '@/components/common/carousel-wrapper'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Typography } from '@/components/common/typography'
import type { CarouselApi } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import { TopCountriesType, type DestinationItem } from '@/lib/validations/schemas/homepageSettings'
import { Briefcase, DollarSign, Users } from 'lucide-react'
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
    <Section variant={'md'} className={cn('relative overflow-hidden')}>
      <Container className='relative'>
        <SectionHeading
          subtitle={data.subtitle || 'Top Destinations'}
          title={data.title || 'Explore Top Countries'}
          description="Discover the world's most breathtaking destinations with our curated collection of extraordinary travel experiences."
          variant='gradient'
          alignment='center'
        />

        {/* Rail header row: slide counter + prev/next, driven by the carousel below via onApiChange */}
        <div className='relative mb-8'>
          <CarouselWrapper
            loop
            showArrows={true}
            showDots
            dotsPosition='below'
            itemsPerView={{ default: 1, sm: 2, lg: 3, xl: 4 }}
            // contentClassName='pt-6 pb-10'
            itemClassName='pb-12!'
            onApiChange={setCarouselState}
          >
            {data.destinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} index={index} />
            ))}
          </CarouselWrapper>
        </div>
      </Container>
    </Section>
  )
}
