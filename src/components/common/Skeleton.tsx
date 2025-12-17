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

/**
 * WhoWeAre loading skeleton
 */
const WhoWeAreLoadingSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className='space-y-12'>
      {/* Header skeleton */}
      <div className='space-y-4 text-center'>
        <Skeleton className='mx-auto w-32 h-5' />
        <Skeleton className='mx-auto w-80 h-8 sm:h-10' />
      </div>

      {/* Features grid skeleton */}
      <div className='gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='p-6 border border-border/20 rounded-2xl'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              {/* Icon skeleton */}
              <Skeleton className='rounded-full w-20 h-20' />
              {/* Title skeleton */}
              <Skeleton className='w-32 h-6' />
              {/* Description skeleton */}
              <div className='space-y-2'>
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-5/6 h-4' />
                <Skeleton className='w-4/5 h-4' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * FAQ loading skeleton
 */
const FAQLoadingSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className='space-y-12'>
      {/* Header skeleton */}
      <div className='space-y-4 text-center'>
        <Skeleton className='mx-auto w-16 h-5' />
        <Skeleton className='mx-auto w-96 h-8 sm:h-10' />
      </div>

      {/* FAQ items skeleton */}
      <div className='space-y-4 mx-auto max-w-4xl'>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='p-6 border border-border/20 rounded-2xl'>
            <div className='flex justify-between items-center gap-4'>
              <Skeleton className='w-3/4 h-6' />
              <Skeleton className='rounded-full w-8 h-8' />
            </div>
          </div>
        ))}
      </div>

      {/* CTA skeleton */}
      <div className='mx-auto max-w-4xl'>
        <div className='space-y-4 bg-muted/30 p-8 rounded-2xl text-center'>
          <Skeleton className='mx-auto w-48 h-6' />
          <Skeleton className='mx-auto w-96 h-4' />
          <Skeleton className='mx-auto rounded-full w-40 h-10' />
        </div>
      </div>
    </div>
  )
}

/**
 * Article loading skeleton
 */
const ArticleLoadingSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className='space-y-16'>
      {/* Header skeleton */}
      <div className='space-y-4 text-center'>
        <Skeleton className='mx-auto w-20 h-5' />
        <Skeleton className='mx-auto w-96 h-8 sm:h-10' />
        <Skeleton className='mx-auto rounded-full w-20 h-1' />
      </div>

      {/* Article grid skeleton */}
      <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='border border-border/20 rounded-3xl overflow-hidden'>
            {/* Image skeleton */}
            <Skeleton className='w-full aspect-[16/10]' />

            {/* Content skeleton */}
            <div className='space-y-4 p-6'>
              {/* Meta info skeleton */}
              <div className='flex items-center gap-4'>
                <Skeleton className='w-20 h-4' />
                <Skeleton className='w-16 h-4' />
              </div>

              {/* Title skeleton */}
              <div className='space-y-2'>
                <Skeleton className='w-full h-6' />
                <Skeleton className='w-3/4 h-6' />
              </div>

              {/* Excerpt skeleton */}
              <div className='space-y-2'>
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-5/6 h-4' />
                <Skeleton className='w-4/5 h-4' />
              </div>

              {/* Author and button skeleton */}
              <div className='flex justify-between items-center pt-2'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='rounded-full w-8 h-8' />
                  <Skeleton className='w-20 h-4' />
                </div>
                <Skeleton className='rounded-full w-12 h-12' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View all button skeleton */}
      <div className='text-center'>
        <Skeleton className='mx-auto rounded-full w-48 h-12' />
      </div>
    </div>
  )
}

/**
 * Testimonials loading skeleton
 */
const TestimonialsLoadingSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className='space-y-16'>
      {/* Header skeleton */}
      <div className='space-y-4 text-center'>
        <Skeleton className='mx-auto w-24 h-5' />
        <Skeleton className='mx-auto w-96 h-8 sm:h-10' />
        <Skeleton className='mx-auto rounded-full w-24 h-1' />
      </div>

      {/* Stats skeleton */}
      <div className='bg-muted/30 p-8 rounded-3xl'>
        <div className='flex md:flex-row flex-col justify-center items-center gap-8'>
          <div className='flex items-center gap-3'>
            <Skeleton className='rounded-full w-12 h-12' />
            <div className='space-y-2'>
              <Skeleton className='w-12 h-8' />
              <Skeleton className='w-24 h-4' />
            </div>
          </div>
          <Skeleton className='hidden md:block w-px h-12' />
          <div className='flex items-center gap-3'>
            <Skeleton className='rounded-full w-12 h-12' />
            <div className='space-y-2'>
              <Skeleton className='w-12 h-8' />
              <Skeleton className='w-24 h-4' />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials grid skeleton */}
      <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className='space-y-6 p-8 border border-border/20 rounded-3xl'>
            {/* Quote icon skeleton */}
            <Skeleton className='rounded-2xl w-12 h-12' />

            {/* Review skeleton */}
            <div className='space-y-2'>
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-5/6 h-4' />
              <Skeleton className='w-4/5 h-4' />
            </div>

            {/* Rating skeleton */}
            <div className='flex items-center gap-1'>
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Skeleton key={starIndex} className='rounded-sm w-4 h-4' />
              ))}
              <Skeleton className='ml-2 w-8 h-4' />
            </div>

            {/* User info skeleton */}
            <div className='flex items-center gap-4 pt-4'>
              <Skeleton className='rounded-full w-14 h-14' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='w-24 h-5' />
                <Skeleton className='w-20 h-4' />
              </div>
              <Skeleton className='rounded-full w-16 h-6' />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots skeleton */}
      <div className='flex justify-center gap-2'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='rounded-full w-3 h-3' />
        ))}
      </div>

      {/* CTA skeleton */}
      <div className='space-y-4 bg-muted/30 p-10 rounded-3xl text-center'>
        <Skeleton className='mx-auto w-48 h-8' />
        <Skeleton className='mx-auto w-96 h-4' />
        <Skeleton className='mx-auto rounded-full w-40 h-12' />
      </div>
    </div>
  )
}

export {
  ArticleLoadingSkeleton,
  FAQLoadingSkeleton,
  Skeleton,
  StatsLoadingSkeleton,
  TestimonialsLoadingSkeleton,
  WhoWeAreLoadingSkeleton
}

