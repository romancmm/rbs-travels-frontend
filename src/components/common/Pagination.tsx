'use client'

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationUI
} from '@/components/ui/pagination'

import { PaginationData } from '@/hooks/useFilter'
import { usePaginationRange } from '@/hooks/usePaginationRange'
import { cn } from '@/lib/utils'
import { useSearchFilters } from '@/plugins/filters/useSearchFilters'
import { defaultFilter } from '@/validations/filter-schemas'
import { useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface PaginationProps {
  data?: PaginationData
  enableInfiniteScroll?: boolean
  defaultLimit?: number
  limitOptions?: number[]
  variant?: 'default' | 'extended'
  scrollToId?: string
}

export default function Pagination({
  data,
  enableInfiniteScroll = false,
  limitOptions = [10, 20, 50, 100],
  defaultLimit,
  variant = 'default',
  scrollToId
}: PaginationProps) {
  const { filters, setFilters } = useSearchFilters(defaultFilter)

  const {
    page: backendPage = 0,
    totalPages = 1,
    totalItems = 0,
    hasNext = false,
    hasPrev = false,
    nextPage: backendNextPage = null,
    prevPage: backendPrevPage = null,
    firstPage: backendFirstPage = 0,
    lastPage: backendLastPage = 0
  } = data ?? {}

  // Backend pagination is 0-indexed (matches the 0-indexed `page` the API
  // expects - see useSearchFilters.queryString). The UI stays 1-indexed
  // (page buttons, "Page X of Y", and the `page` URL param), so convert here.
  const page = backendPage + 1
  const firstPage = backendFirstPage + 1
  const lastPage = backendLastPage + 1
  const nextPage = backendNextPage != null ? backendNextPage + 1 : null
  const prevPage = backendPrevPage != null ? backendPrevPage + 1 : null

  // Computed values
  const pageSize = filters.limit ? Number(filters.limit) : defaultLimit || limitOptions[0]

  const pageRange = usePaginationRange({
    currentPage: page,
    totalPages
  })

  // Validate and compute select value
  const pageSizeStr = String(pageSize)
  const validOptions = limitOptions.map(String)
  const selectValue = validOptions.includes(pageSizeStr) ? pageSizeStr : String(limitOptions[0])

  const observerRef = useRef<HTMLDivElement | null>(null)

  const scrollToTarget = () => {
    if (scrollToId) {
      const el = document.getElementById(scrollToId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    setFilters({ page: String(newPage), limit: String(pageSize) })
    scrollToTarget()
  }

  const handlePageSizeChange = (value: string) => {
    setFilters({ limit: value, page: '1' })
    scrollToTarget()
  }

  // Infinite scroll observer
  useEffect(() => {
    if (!enableInfiniteScroll || !hasNext) return

    const ref = observerRef.current
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNext && nextPage != null) {
          setFilters({ page: String(nextPage), limit: String(pageSize) })
          scrollToTarget()
        }
      },
      { threshold: 1 }
    )

    observer.observe(ref)

    return () => {
      observer.unobserve(ref)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNext, nextPage, enableInfiniteScroll])

  const startItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const endItem = Math.min(page * pageSize, totalItems)

  // Never render pagination controls when there's no data to paginate.
  if (!data || totalItems === 0) return null

  return (
    <div className='flex flex-wrap justify-between items-center gap-4 py-2 max-w-full'>
      {variant === 'extended' && (
        <div className='text-xs md:text-sm whitespace-nowrap'>
          Showing {startItem}–{endItem} of {totalItems}
        </div>
      )}

      {/* Page Size Selector */}
      <div className='xl:order-last'>
        <Select
          value={selectValue}
          defaultValue={String(limitOptions[0])}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className='gap-1 bg-white shadow-gray-200/40 shadow-sm px-3 border focus-visible:border-gray-200 rounded-lg focus-visible:ring-0 w-fit h-9 font-medium text-sm cursor-pointer'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent align='end'>
            {limitOptions.map((option) => (
              <SelectItem value={String(option)} key={option}>
                {option} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {totalPages > 1 && (
        <PaginationUI className='flex flex-1 justify-start sm:justify-center w-full overflow-x-auto'>
          <PaginationContent className='flex-nowrap gap-1 sm:gap-2'>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPrev && handlePageChange(prevPage ?? firstPage)}
                className={cn('hover:bg-gray-100 text-sm cursor-pointer', {
                  'pointer-events-none opacity-50': !hasPrev
                })}
                aria-label='Previous Page'
              />
            </PaginationItem>

            {pageRange.map((pageNumber, i) => {
              // Only keep the page right next to the current one visible on small
              // screens; the rest (first/last/ellipsis) only show from `sm` up.
              const isNearCurrent = pageNumber !== '...' && Math.abs(Number(pageNumber) - page) <= 1

              return (
                <PaginationItem key={i} className={cn({ 'hidden md:block': !isNearCurrent })}>
                  {pageNumber === '...' ? (
                    <PaginationEllipsis className='border rounded-md text-gray-500' />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(Number(pageNumber))}
                      isActive={Number(pageNumber) === page}
                      className={cn('border border-gray-100 text-sm cursor-pointer', {
                        'border-gray-200 bg-gray-100': Number(pageNumber) === page
                      })}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => hasNext && handlePageChange(nextPage ?? lastPage)}
                className={cn('hover:bg-gray-100 text-sm cursor-pointer', {
                  'pointer-events-none opacity-50': !hasNext
                })}
                aria-label='Next Page'
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationUI>
      )}

      {enableInfiniteScroll && <div ref={observerRef} className='h-1' />}
    </div>
  )
}
