'use client'

import { cn } from '@/lib/utils'

/**
 * Skeleton component for loading states
 */
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('bg-muted/40 rounded-md animate-pulse', className)} {...props} />
}

/**
 * Stats skeleton for loading state
 */
const StatsLoadingSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className='flex sm:flex-row flex-col justify-evenly items-center gap-6 lg:gap-10 py-4 border-y w-full'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='flex items-center gap-4 p-4 w-full'>
          {/* Icon skeleton */}
          <div className='flex justify-center items-center size-16 sm:size-20 shrink-0'>
            <Skeleton className='rounded-full w-10 sm:w-12 h-10 sm:h-12' />
          </div>

          {/* Content skeleton */}
          <div className='flex-1 space-y-2 min-w-0'>
            <Skeleton className='w-16 sm:w-20 h-6 sm:h-8' />
            <Skeleton className='w-24 sm:w-32 h-4' />
          </div>
        </div>
      ))}
    </div>
  )
}

export { Skeleton, StatsLoadingSkeleton }
