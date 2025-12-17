'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type { PaginationData } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/useFilter'

interface PaginationProps {
  paginationData?: PaginationData
  pageSizeOptions?: number[]
  className?: string
  showRowsPerPage?: boolean
  showPageInfo?: boolean
  showFirstLastButtons?: boolean
}

export function Pagination({
  paginationData,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className = '',
  showRowsPerPage = true,
  showPageInfo = true,
  showFirstLastButtons = true
}: PaginationProps) {
  const {
    page,
    limit,
    totalPages,
    total,
    hasNext,
    hasPrev,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage
  } = usePagination(paginationData)

  // Don't render if there's no pagination data
  if (!paginationData) {
    return null
  }

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-8 ${className}`}
    >
      {/* Rows per page */}
      {showRowsPerPage && (
        <div className='flex items-center gap-2 order-2 sm:order-1'>
          <Label
            htmlFor='pagination-rows-per-page'
            className='font-medium text-white text-xs sm:text-sm whitespace-nowrap'
            style={{ fontFamily: 'Manrope' }}
          >
            Rows per page
          </Label>
          <Select value={`${limit}`} onValueChange={(value) => setLimit(Number(value))}>
            <SelectTrigger
              size='sm'
              className='bg-background border-white/20 w-16 sm:w-20 text-white'
              id='pagination-rows-per-page'
            >
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top' className='bg-background border-white/20'>
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                  className='hover:bg-white/10 focus:bg-white/10 text-white'
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {/* Page info */}
      {showPageInfo && (
        <div className='flex justify-center items-center order-1 sm:order-2 font-medium text-white text-xs sm:text-sm'>
          <span style={{ fontFamily: 'Manrope' }}>
            Page {page} of {totalPages}
          </span>
          {total > 0 && (
            <span className='ml-2 text-white/60' style={{ fontFamily: 'Manrope' }}>
              ({total} total)
            </span>
          )}
        </div>
      )}
      {/* Navigation buttons */}
      <div className='flex justify-center items-center gap-1 sm:gap-2 order-3'>
        {showFirstLastButtons && (
          <Button
            variant='outline'
            className='sm:flex bg-background hover:bg-white/10 disabled:opacity-50 p-0 border-white/20 w-7 sm:w-8 h-7 sm:h-8 text-white'
            onClick={goToFirstPage}
            disabled={!hasPrev}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeft className='w-3 sm:w-4 h-3 sm:h-4' />
          </Button>
        )}

        <Button
          variant='outline'
          className='bg-background hover:bg-white/10 disabled:opacity-50 border-white/20 w-7 sm:w-8 h-7 sm:h-8 text-white'
          size='icon'
          onClick={prevPage}
          disabled={!hasPrev}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeft className='w-3 sm:w-4 h-3 sm:h-4' />
        </Button>

        <Button
          variant='outline'
          className='bg-background hover:bg-white/10 disabled:opacity-50 border-white/20 w-7 sm:w-8 h-7 sm:h-8 text-white'
          size='icon'
          onClick={nextPage}
          disabled={!hasNext}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRight className='w-3 sm:w-4 h-3 sm:h-4' />
        </Button>

        {showFirstLastButtons && (
          <Button
            variant='outline'
            className='sm:flex bg-background hover:bg-white/10 disabled:opacity-50 border-white/20 w-7 sm:w-8 h-7 sm:h-8 text-white'
            size='icon'
            onClick={goToLastPage}
            disabled={!hasNext}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRight className='w-3 sm:w-4 h-3 sm:h-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
