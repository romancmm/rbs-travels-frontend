'use client'

import Autoplay from 'embla-carousel-autoplay'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../ui/carousel'

type ItemsPerView = {
  default?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  '2xl'?: number
}

type SlideLayout = {
  /** Each slide is either a single node (rows=1) or a vertical stack of nodes */
  slides: Array<React.ReactNode | React.ReactNode[]>
  /** Number of columns (scroll units) the carousel holds */
  columns: number
  /** True when multi-row was requested — basis is clamped to `columns` so a
   *  short rail fills the width instead of leaving empty trailing slots */
  clampToColumns: boolean
}

/**
 * Lay children out for the carousel.
 *
 * rows=1 → one child per slide (unchanged behavior).
 *
 * rows>1 → a two-row (or N-row) rail where **columns are filled first**:
 *   • `itemsPerView` is columns-per-row, so items-per-row scales with it.
 *   • `rows` is a MAX — with too few items to fill one row, it collapses to
 *     fewer rows rather than reserving empty column slots.
 *   • items read row-major (left-to-right, then wrap down), so column j holds
 *     items [j, j+columns, j+2·columns, …].
 */
function buildSlideLayout(children: React.ReactNode, rows: number, maxPerRow: number): SlideLayout {
  const items = React.Children.toArray(children)

  if (rows <= 1) {
    return { slides: items, columns: items.length, clampToColumns: false }
  }

  // Only stack into extra rows once a full row's worth of columns is exceeded
  const effectiveRows = Math.min(rows, Math.max(1, Math.ceil(items.length / maxPerRow)))

  if (effectiveRows <= 1) {
    return { slides: items, columns: items.length, clampToColumns: true }
  }

  const columns = Math.ceil(items.length / effectiveRows)
  const slides: React.ReactNode[][] = Array.from({ length: columns }, () => [])
  // Row-major: index i sits at row=⌊i/columns⌋, column=i%columns
  items.forEach((item, i) => slides[i % columns].push(item))

  return { slides, columns, clampToColumns: true }
}

interface CarouselWrapperProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  itemClassName?: string

  /**
   * Autoplay
   */
  autoplay?: boolean
  autoplaySpeed?: number

  /**
   * Infinite scroll
   */
  loop?: boolean

  /**
   * Navigation
   */
  showArrows?: boolean
  showDots?: boolean

  /**
   * Arrow visibility behavior
   */
  arrowVisibility?: 'always' | 'hover' | 'hidden'

  /**
   * Arrow style.
   * - `round` — fully circular, floats inset from the carousel edge
   * - `half`  — left arrow rounded on right side only (D-shape), right arrow
   *             rounded on left side only; both flush at the carousel edge
   */
  arrow?: {
    variant?: 'round' | 'half'
    size?: 'sm' | 'md' | 'lg'
  }

  /**
   * Responsive items per view
   */
  itemsPerView?: ItemsPerView

  /**
   * Rows per slide. Children are chunked column-wise, so `rows={2}` gives the
   * classic two-row rail: each slide is a vertical stack of two items and
   * `itemsPerView` keeps meaning visible columns.
   */
  rows?: number

  /**
   * Carousel alignment
   */
  align?: 'start' | 'center' | 'end'

  /**
   * Escape hatch for callers that need their own controls (e.g. a custom
   * counter or arrow buttons placed outside the carousel) instead of - or in
   * addition to - the built-in arrows/dots. Fires whenever the embla API,
   * current slide, or slide count changes; pair with `showArrows`/`showDots`
   * set to `false` to fully replace the built-in navigation.
   */
  onApiChange?: (state: { api: CarouselApi; current: number; count: number }) => void
}

export default function CarouselWrapper({
  children,
  className,
  contentClassName,
  itemClassName,

  autoplay = false,
  autoplaySpeed = 5000,

  loop = false,

  showArrows = true,
  showDots = true,

  arrowVisibility = 'hover',

  arrow = {},

  align = 'start',

  itemsPerView = {
    default: 1,
    sm: 2,
    lg: 4
  },

  rows = 1,

  onApiChange
}: CarouselWrapperProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    onApiChange?.({ api, current, count })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, current, count])

  const plugin = React.useMemo(() => {
    if (!autoplay) return undefined

    return Autoplay({
      delay: autoplaySpeed,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  }, [autoplay, autoplaySpeed])

  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    const onInit = () => {
      setCount(api.scrollSnapList().length)
    }

    onSelect()
    onInit()

    api.on('select', onSelect)
    api.on('reInit', onInit)

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onInit)
    }
  }, [api])

  React.useEffect(() => {
    const handleResize = () => {
      api?.reInit()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [api])

  const arrowVariant = arrow.variant ?? 'round'
  const arrowSize = arrow.size ?? 'md'

  const arrowSizeMap = {
    sm: { button: 'h-7 w-7', icon: 'h-3.5 w-3.5' },
    md: { button: 'h-9 w-9', icon: 'h-5 w-5' },
    lg: { button: 'h-12 w-12', icon: 'h-6 w-6' }
  }

  const { button: buttonSize, icon: iconSize } = arrowSizeMap[arrowSize]

  const arrowBase = cn(
    'top-1/2 z-20 absolute flex justify-center items-center bg-white/90 backdrop-blur transition-all -translate-y-1/2 duration-300 cursor-pointer',
    buttonSize,
    // round: uniform shadow; semiround: directional shadow applied per-arrow below
    arrowVariant === 'round' ? 'rounded-full shadow-md' : ''
  )

  // Logical start/end (not left/right) so positioning auto-mirrors under RTL
  // instead of needing a separate JS-detected RTL branch - Embla's own
  // `direction` (set in the base Carousel component) already makes
  // scrollPrev/scrollNext resolve to the visually-correct slide either way.
  const startPos = arrowVariant === 'round' ? 'inset-s-3' : 'inset-s-0'
  const endPos = arrowVariant === 'round' ? 'inset-e-3' : 'inset-e-0'

  // Semiround: start arrow shadow goes toward end + bottom, and vice versa.
  // The shadow's arbitrary offset is a raw px value (not a logical property),
  // so it needs an explicit rtl: override to flip sign under RTL.
  const startShape =
    arrowVariant === 'half'
      ? 'rounded-e-full shadow-[8px_1px_15px_rgba(0,0,0,0.05)] rtl:shadow-[-8px_1px_15px_rgba(0,0,0,0.05)] min-w-8'
      : ''
  const endShape =
    arrowVariant === 'half'
      ? 'rounded-s-full shadow-[-8px_1px_15px_rgba(0,0,0,0.05)] rtl:shadow-[8px_1px_15px_rgba(0,0,0,0.05)] min-w-8'
      : ''

  const startArrowClass =
    arrowVisibility === 'hover'
      ? 'opacity-0 -translate-x-6 rtl:translate-x-6 group-hover:opacity-100 group-hover:translate-x-0'
      : 'opacity-100'

  const endArrowClass =
    arrowVisibility === 'hover'
      ? 'opacity-0 translate-x-6 rtl:-translate-x-6 group-hover:opacity-100 group-hover:translate-x-0'
      : 'opacity-100'

  // Widest row capacity across breakpoints — drives how many rows a given item
  // count needs before stacking (see buildSlideLayout).
  const maxPerRow = React.useMemo(() => {
    const values = Object.values(itemsPerView).filter((v): v is number => typeof v === 'number')
    return Math.max(1, Math.round(values.length ? Math.max(...values) : 1))
  }, [itemsPerView])

  const layout = React.useMemo(
    () => buildSlideLayout(children, rows, maxPerRow),
    [children, rows, maxPerRow]
  )

  // Dynamically build CSS variables and fallback chain (sm -> default, md -> sm, etc.)
  const responsiveStyle = React.useMemo(() => {
    // For multi-row rails, never reserve more columns than exist, so a short
    // rail expands to fill the width instead of leaving empty trailing slots.
    const cap = (n: number) => (layout.clampToColumns ? Math.min(n, layout.columns) : n)

    const defaultItems = cap(itemsPerView.default || 1)
    const smItems = cap(itemsPerView.sm || itemsPerView.default || 1)
    const mdItems = cap(itemsPerView.md || itemsPerView.sm || itemsPerView.default || 1)
    const lgItems = cap(
      itemsPerView.lg || itemsPerView.md || itemsPerView.sm || itemsPerView.default || 1
    )
    const xlItems = cap(
      itemsPerView.xl ||
        itemsPerView.lg ||
        itemsPerView.md ||
        itemsPerView.sm ||
        itemsPerView.default ||
        1
    )
    const xxlItems = cap(
      itemsPerView['2xl'] ||
        itemsPerView.xl ||
        itemsPerView.lg ||
        itemsPerView.md ||
        itemsPerView.sm ||
        itemsPerView.default ||
        1
    )

    return {
      '--default-items': defaultItems,
      '--sm-items': smItems,
      '--md-items': mdItems,
      '--lg-items': lgItems,
      '--xl-items': xlItems,
      '--2xl-items': xxlItems
    } as React.CSSProperties
  }, [itemsPerView, layout])

  return (
    <div className='group relative w-full'>
      <Carousel
        setApi={setApi}
        plugins={plugin ? [plugin] : []}
        opts={{
          loop,
          align
        }}
        className={cn('w-full', className)}
      >
        {/* Inject the CSS variables into the parent container so children can access them */}
        <CarouselContent
          className={cn('flex -ml-2.5 sm:-ml-3', contentClassName)}
          style={responsiveStyle}
        >
          {layout.slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className={cn(
                'pb-2 pl-2.5_sm:pl-3 min-w-0 shrink-0 grow-0',
                // Static Tailwind classes with CSS variables (JIT will successfully pick these up!)
                'basis-[calc(100%/var(--default-items))]',
                'sm:basis-[calc(100%/var(--sm-items))]',
                'md:basis-[calc(100%/var(--md-items))]',
                'lg:basis-[calc(100%/var(--lg-items))]',
                'xl:basis-[calc(100%/var(--xl-items))]',
                '2xl:basis-[calc(100%/var(--2xl-items))]',
                itemClassName
              )}
            >
              {Array.isArray(slide) ? (
                // Vertical gap mirrors the horizontal slide gutter
                <div className='gap-2.5 sm:gap-3 grid'>{slide}</div>
              ) : (
                slide
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Previous (reading-order previous - visually the start side, wherever that is) */}
        {showArrows && arrowVisibility !== 'hidden' && count > 1 && (
          <button
            type='button'
            onClick={() => api?.scrollPrev()}
            className={cn(arrowBase, startPos, startShape, startArrowClass)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={cn('text-primary rtl:rotate-180', iconSize)}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
        )}

        {/* Next (reading-order next - visually the end side) */}
        {showArrows && arrowVisibility !== 'hidden' && count > 1 && (
          <button
            type='button'
            onClick={() => api?.scrollNext()}
            className={cn(arrowBase, endPos, endShape, endArrowClass)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className={cn('text-primary rtl:rotate-180', iconSize)}
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        )}

        {/* Dots */}
        {showDots && count > 1 && (
          <div className='bottom-3 left-1/2 z-20 absolute flex gap-2 -translate-x-1/2'>
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type='button'
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'rounded-full w-2.5 h-2.5 transition-all duration-300 cursor-pointer',
                  current === index ? 'bg-primary ring-primary/30 ring-2' : 'bg-white/70'
                )}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  )
}
