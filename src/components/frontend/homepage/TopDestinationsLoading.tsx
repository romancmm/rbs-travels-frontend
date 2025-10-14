import { Container } from '@/components/common/container'
import { sectionVariants } from '@/components/common/section'
import { cn } from '@/lib/utils'

const DestinationCardSkeleton = () => (
  <div className='flex-none w-80 scroll-snap-align-start'>
    <div className='bg-white shadow-lg rounded-2xl overflow-hidden'>
      {/* Image skeleton */}
      <div className='relative bg-gray-200 h-64 animate-pulse'>
        {/* Price badge skeleton */}
        <div className='top-4 left-4 absolute bg-gray-300 rounded-full w-20 h-7 animate-pulse' />
        {/* Type badge skeleton */}
        <div className='top-4 right-4 absolute bg-gray-300 rounded-full w-16 h-7 animate-pulse' />
        {/* Rating skeleton */}
        <div className='bottom-4 left-4 absolute bg-gray-300 rounded-lg w-12 h-6 animate-pulse' />
      </div>

      {/* Content skeleton */}
      <div className='space-y-4 p-6'>
        {/* Title skeleton */}
        <div className='space-y-2'>
          <div className='bg-gray-200 rounded w-3/4 h-6 animate-pulse' />
          <div className='bg-gray-200 rounded w-full h-4 animate-pulse' />
          <div className='bg-gray-200 rounded w-2/3 h-4 animate-pulse' />
        </div>

        {/* Metadata skeleton */}
        <div className='flex justify-between items-center'>
          <div className='bg-gray-200 rounded w-20 h-4 animate-pulse' />
          <div className='bg-gray-200 rounded w-24 h-4 animate-pulse' />
        </div>

        {/* Action button skeleton */}
        <div className='bg-gray-200 rounded w-32 h-5 animate-pulse' />
      </div>
    </div>
  </div>
)

export default function TopDestinationsLoading() {
  return (
    <section
      className={cn(sectionVariants({ variant: 'xl' }), 'bg-gradient-to-b from-gray-50 to-white')}
    >
      <Container>
        {/* Header skeleton */}
        <div className='space-y-4 mb-12 text-center'>
          <div className='bg-gray-200 mx-auto rounded w-32 h-5 animate-pulse' />
          <div className='bg-gray-200 mx-auto rounded w-80 h-10 animate-pulse' />
          <div className='bg-gray-200 mx-auto rounded w-96 h-6 animate-pulse' />
        </div>

        {/* Navigation controls skeleton */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-3'>
            <div className='bg-gray-200 rounded-full w-10 h-10 animate-pulse' />
            <div className='bg-gray-200 rounded-full w-10 h-10 animate-pulse' />
          </div>
          <div className='bg-gray-200 rounded w-48 h-5 animate-pulse' />
        </div>

        {/* Destinations grid skeleton */}
        <div className='flex gap-6 pb-4 overflow-hidden'>
          {Array.from({ length: 4 }).map((_, index) => (
            <DestinationCardSkeleton key={index} />
          ))}
        </div>

        {/* Pagination dots skeleton */}
        <div className='flex justify-center items-center gap-2 mt-8'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className='bg-gray-200 rounded-full w-2 h-2 animate-pulse' />
          ))}
        </div>

        {/* CTA button skeleton */}
        <div className='mt-12 text-center'>
          <div className='bg-gray-200 mx-auto rounded-xl w-64 h-12 animate-pulse' />
        </div>
      </Container>
    </section>
  )
}
