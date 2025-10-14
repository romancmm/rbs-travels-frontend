'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { sectionVariants } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import ClassNames from 'embla-carousel-class-names'
import {
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Filter,
  Heart,
  MapPin,
  Mountain,
  Palmtree,
  Star,
  Users,
  Waves
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Destination {
  id: number
  name: string
  image: string
  tours: number
  description: string
  price: string
  duration: string
  type: string
}

interface TopDestinationsProps {
  data: {
    title: string
    subtitle: string
    destinations: Destination[]
  }
}

const categoryIcons = {
  Historical: Mountain,
  Archaeological: Building2,
  Cultural: Building2,
  Adventure: Mountain,
  'Beach Resort': Waves,
  'Urban Experience': Building2,
  Luxury: Building2,
  Tropical: Palmtree
}

const filters = [
  { id: 'all', label: 'All Destinations', icon: MapPin },
  { id: 'Adventure', label: 'Adventure', icon: Mountain },
  { id: 'Beach Resort', label: 'Beach & Resort', icon: Waves },
  { id: 'Cultural', label: 'Cultural', icon: Building2 },
  { id: 'Luxury', label: 'Luxury', icon: Star }
]

const DestinationCard = ({ destination, index }: { destination: Destination; index: number }) => {
  const [isLiked, setIsLiked] = useState(false)
  const IconComponent = categoryIcons[destination.type as keyof typeof categoryIcons] || MapPin

  return (
    <div
      className='group slide-in-from-bottom-4 relative bg-white shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden transition-all hover:-translate-y-3 animate-in duration-700'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className='relative h-72 overflow-hidden'>
        <CustomImage
          src={destination.image}
          alt={destination.name}
          width={400}
          height={300}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
        />

        {/* Dynamic overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

        {/* Floating elements */}
        <div className='top-4 left-4 absolute flex items-center gap-2'>
          <div className='bg-primary shadow-xl backdrop-blur-sm px-4 py-2 rounded-full font-bold text-white text-sm'>
            {destination.price}
          </div>
        </div>

        <div className='top-4 right-4 absolute flex items-center gap-2'>
          <div className='flex items-center gap-1 bg-white/95 shadow-lg backdrop-blur-sm px-3 py-2 rounded-full font-medium text-gray-800 text-xs'>
            <IconComponent className='w-3 h-3' />
            {destination.type}
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              'flex justify-center items-center shadow-lg backdrop-blur-sm rounded-full w-9 h-9 transition-all duration-300',
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white/95 text-gray-600 hover:bg-red-50 hover:text-red-500'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          </button>
        </div>

        {/* Rating and photos overlay */}
        <div className='bottom-4 left-4 absolute flex items-center gap-3'>
          <div className='flex items-center gap-1 bg-white/95 shadow-lg backdrop-blur-sm px-3 py-2 rounded-lg'>
            <Star className='fill-yellow-400 w-4 h-4 text-yellow-400' />
            <span className='font-semibold text-gray-800 text-sm'>4.9</span>
            <span className='text-gray-600 text-xs'>(128)</span>
          </div>
          <div className='flex items-center gap-1 bg-white/95 shadow-lg backdrop-blur-sm px-3 py-2 rounded-lg'>
            <Camera className='w-4 h-4 text-gray-600' />
            <span className='font-medium text-gray-800 text-xs'>2.3k photos</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='space-y-4 p-6'>
        {/* Title and Description */}
        <div className='space-y-2'>
          <Typography
            variant='h6'
            weight='bold'
            className='text-gray-800 group-hover:text-primary line-clamp-1 transition-colors'
          >
            {destination.name}
          </Typography>
          <Typography variant='body2' className='text-gray-600 line-clamp-2 leading-relaxed'>
            {destination.description}
          </Typography>
        </div>

        {/* Metadata with enhanced styling */}
        <div className='flex justify-between items-center pt-2 border-gray-100 border-t'>
          <div className='flex items-center gap-1 text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span className='font-medium text-sm'>{destination.duration}</span>
          </div>
          <div className='flex items-center gap-1 text-gray-500'>
            <Users className='w-4 h-4' />
            <span className='font-medium text-sm'>{destination.tours} tours</span>
          </div>
        </div>

        {/* Enhanced Action Button */}
        <CustomLink
          href={`/destination/${destination.id}`}
          className='group/btn inline-flex justify-center items-center gap-2 bg-gradient-to-r from-primary hover:from-primary/90 to-primary/90 hover:to-primary shadow-lg hover:shadow-xl px-4 py-3 rounded-xl w-full font-semibold text-white hover:scale-105 transition-all duration-300'
        >
          <span>Explore Destination</span>
          <ArrowRight className='w-4 h-4 transition-transform group-hover/btn:translate-x-1' />
        </CustomLink>
      </div>
    </div>
  )
}

export default function TopDestinations({ data }: TopDestinationsProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const filteredDestinations = useMemo(() => {
    if (activeFilter === 'all') return data.destinations
    return data.destinations.filter((dest) => dest.type === activeFilter)
  }, [data.destinations, activeFilter])

  // Enhanced auto-rotation plugin with better UX
  const autoplayPlugin = Autoplay({
    delay: 5000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
    stopOnFocusIn: true
  })

  // Class names plugin for enhanced styling
  const classNamesPlugin = ClassNames({
    snapped: 'opacity-100 scale-100',
    draggable: 'cursor-grab',
    dragging: 'cursor-grabbing'
  })

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return

    setCurrent(emblaApi.selectedScrollSnap() + 1)
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    onSelect(api)

    api.on('reInit', onSelect)
    api.on('select', onSelect)

    return () => {
      api?.off('select', onSelect)
      api?.off('reInit', onSelect)
    }
  }, [api, onSelect])

  // Reset carousel when filter changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0, true)
    }
  }, [activeFilter, api])

  if (!data?.destinations?.length) return null

  return (
    <section
      className={cn(
        sectionVariants({ variant: 'xl' }),
        'bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 relative overflow-hidden'
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
        {/* Enhanced Header */}
        <div className='space-y-6 mb-12 text-center'>
          <div className='inline-flex justify-center items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary'>
            <MapPin className='w-4 h-4' />
            <Typography variant='body2' weight='medium' className='uppercase tracking-wider'>
              {data.subtitle}
            </Typography>
          </div>
          <Typography variant='h2' weight='bold' className='mx-auto max-w-3xl text-gray-800'>
            {data.title}
          </Typography>
          <Typography variant='body1' className='mx-auto max-w-2xl text-gray-600 leading-relaxed'>
            Discover the world&apos;s most breathtaking destinations with our curated collection of
            extraordinary travel experiences.
          </Typography>
        </div>

        {/* Enhanced Filter Tabs */}
        <div className='flex flex-wrap justify-center items-center gap-3 mb-10'>
          {filters.map((filter) => {
            const IconComponent = filter.icon
            const isActive = activeFilter === filter.id
            const count =
              filter.id === 'all'
                ? data.destinations.length
                : data.destinations.filter((d) => d.type === filter.id).length

            return (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id)
                  // Reset carousel when filter changes
                  if (api) {
                    api.scrollTo(0)
                  }
                }}
                className={cn(
                  'flex items-center gap-2 shadow-sm px-4 py-2.5 rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary border border-gray-200'
                )}
              >
                <IconComponent className='w-4 h-4' />
                <span className='font-medium'>{filter.label}</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    isActive ? 'bg-white/20' : 'bg-gray-100'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Enhanced Carousel Implementation */}
        <div className='relative mb-8'>
          <Carousel
            setApi={setApi}
            className='w-full'
            opts={{
              align: 'start',
              loop: true,
              skipSnaps: false,
              dragFree: true,
              containScroll: 'trimSnaps',
              slidesToScroll: 'auto'
            }}
            // plugins={[autoplayPlugin, classNamesPlugin]}
          >
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center gap-4'>
                <div className='hidden md:flex items-center gap-2 text-gray-500 text-sm'>
                  <Filter className='w-4 h-4' />
                  <span>{filteredDestinations.length} destinations</span>
                </div>
                <div className='flex items-center gap-2 text-gray-500 text-sm'>
                  <span>
                    {current} of {count} slides
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
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
                <CustomLink
                  href='/destinations'
                  className='group flex items-center gap-2 bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg font-semibold text-primary hover:text-primary/80 transition-colors'
                >
                  <span>View All</span>
                  <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                </CustomLink>
              </div>
            </div>

            <CarouselContent className='-ml-6'>
              {filteredDestinations.map((destination, index) => (
                <CarouselItem
                  key={destination.id}
                  className='pl-6 transition-all duration-500 basis-1/1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'
                >
                  <DestinationCard destination={destination} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Progress Indicators */}
        <div className='flex justify-center items-center gap-2 mb-8'>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'rounded-full h-2 transition-all duration-300',
                index === current - 1 ? 'bg-primary w-8' : 'bg-gray-300 hover:bg-gray-400 w-2'
              )}
            />
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div className='space-y-4 mt-16 text-center'>
          <Typography variant='h4' weight='semibold' className='text-gray-800'>
            Ready to Start Your Adventure?
          </Typography>
          <Typography variant='body1' className='mx-auto max-w-md text-gray-600'>
            Let our travel experts help you plan the perfect getaway to any of these amazing
            destinations.
          </Typography>
          <div className='flex sm:flex-row flex-col justify-center items-center gap-4 pt-4'>
            <Button
              size='lg'
              className='bg-gradient-to-r from-primary hover:from-primary/90 to-primary/90 hover:to-primary shadow-xl hover:shadow-2xl px-8 py-4 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300'
            >
              Plan My Journey
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='px-8 py-4 border-gray-300 hover:border-primary rounded-xl text-gray-700 hover:text-primary transition-all duration-300'
            >
              Talk to Expert
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
