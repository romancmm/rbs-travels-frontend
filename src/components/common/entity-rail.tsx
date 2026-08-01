'use client'

import useAsync from '@/hooks/useAsync.hook'
import { cn } from '@/lib/utils'
import { useInView } from 'motion/react'
import { ComponentProps, ReactNode, useRef } from 'react'
import CarouselWrapper from './carousel-wrapper'
import CustomLink from './CustomLink'
import { EmptyState } from './EmptyState'
import { SectionHeading } from './SectionHeading'

type TProps<T> = {
  title: string
  viewAllHref?: string
  /** Self-fetching mode: full request path, already including any fixed query
   * params (shopId, shopSlug, campaignId, etc). Omit and pass `items` directly
   * for controlled mode. */
  path?: string
  /** Pulls the item array out of the raw fetch response — required in
   * self-fetching mode since different endpoints nest the list under
   * different keys (`categories`, `brands`, ...). */
  selectItems?: (data: unknown) => T[]
  /** Controlled mode: parent-provided items, skips the internal fetch entirely. */
  items?: T[]
  loading?: boolean
  /** Must return an element with its own `key` set, same as a normal `.map()` callback. */
  renderItem: (item: T, index: number) => ReactNode
  /** Must return an element with its own `key` set. Omit to show nothing while loading. */
  renderSkeleton?: (index: number) => ReactNode
  skeletonCount?: number
  itemsPerView?: ComponentProps<typeof CarouselWrapper>['itemsPerView']
  arrow?: ComponentProps<typeof CarouselWrapper>['arrow']
  arrowVisibility?: ComponentProps<typeof CarouselWrapper>['arrowVisibility']
  /** Infinite scroll. Default false. */
  loop?: boolean
  /** Dot indicators below the rail, in addition to the arrows. Default false. */
  showDots?: boolean
  /** Skip the built-in title/"See More" heading - for callers with their own
   * bespoke section header who still want the fetch/loading/empty/carousel
   * plumbing this component owns. Default false. */
  hideHeading?: boolean
  className?: string
  /** Wraps the rail in the bordered white card used on shop pages. Default true. */
  wrapInCard?: boolean
  /** 'retry' shows an error state with a retry button; 'hide' silently hides the whole rail.
   * Only applies in self-fetching mode — controlled mode has no fetch to fail, the parent
   * owns empty/error handling itself. Default 'retry'. */
  onError?: 'hide' | 'retry'
}

/**
 * Generic horizontal rail of entity cards (categories, brands, ...) — one
 * component for every "N things in a row" card section that isn't products
 * (see ProductRail for that). Card rendering is fully caller-supplied via
 * `renderItem`/`renderSkeleton` since e.g. CategoryCard and BrandCard take
 * different props, so this component only owns fetch/loading/empty/carousel
 * plumbing.
 *
 * Self-fetching by default (pass `path` + `selectItems`); pass
 * `items`/`loading` instead for controlled mode when the parent already owns
 * the fetch.
 */
export default function EntityRail<T>({
  title,
  viewAllHref,
  path,
  selectItems,
  items: controlledItems,
  loading: controlledLoading,
  renderItem,
  renderSkeleton,
  skeletonCount = 12,
  itemsPerView = { default: 3.5, sm: 4.5, lg: 4 },
  arrow = { size: 'sm', variant: 'half' },
  arrowVisibility = 'hover',
  loop = false,
  showDots = false,
  hideHeading = false,
  className,
  wrapInCard = true,
  onError = 'retry'
}: TProps<T>) {
  const isControlled = path === undefined

  const railRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(railRef, { once: true, amount: 0.1 })

  const {
    data,
    loading: fetchLoading,
    error,
    execute
  } = useAsync<unknown>({
    path: path ?? '',
    method: 'GET',
    immediate: !isControlled && isInView
  })

  const items = isControlled ? (controlledItems ?? []) : (selectItems?.(data) ?? [])
  const loading = isControlled ? !!controlledLoading : fetchLoading
  const hasError = !isControlled && !loading && !!error
  const isEmpty = !isControlled && !loading && !error && items.length === 0
  const hide = !isControlled && (onError === 'hide' ? isEmpty || hasError : isEmpty)

  const content = hasError ? (
    onError === 'retry' ? (
      <EmptyState
        variant='error'
        title={`Could not load ${title.toLowerCase()}`}
        description='Something went wrong while loading this section.'
        action={
          <button
            onClick={() => execute()}
            className='font-semibold text-primary text-sm underline'
          >
            Try again
          </button>
        }
      />
    ) : null
  ) : (
    <>
      {!hideHeading && (
        <div className='flex justify-between items-center gap-4 mb-6'>
          <SectionHeading
            title={title}
            alignment='left'
            animated={false}
            className='mb-0'
            titleClassName='text-lg md:text-xl'
          />
          {viewAllHref && (
            <CustomLink
              href={viewAllHref}
              className='shrink-0 font-semibold text-primary text-sm hover:underline'
            >
              See More
            </CustomLink>
          )}
        </div>
      )}
      <CarouselWrapper
        loop={loop}
        showArrows
        showDots={showDots}
        arrowVisibility={arrowVisibility}
        arrow={arrow}
        itemsPerView={itemsPerView}
      >
        {loading
          ? [...Array(skeletonCount)].map((_, i) => renderSkeleton?.(i))
          : items.map(renderItem)}
      </CarouselWrapper>
    </>
  )

  return (
    <div
      ref={railRef}
      className={cn(
        wrapInCard && 'rounded-2xl border border-gray-200 bg-white p-3 sm:p-5',
        className
      )}
    >
      {!hide && content}
    </div>
  )
}
