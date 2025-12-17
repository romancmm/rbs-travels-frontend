'use client'

import BlogCard from '@/components/card/BlogCard'
import TestimonialCard from '@/components/card/TestimonialCard'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { appendQueryParams } from '@/lib/appendQueryParams'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface GridWithAPIProps {
  id?: string
  title?: string
  subtitle?: string
  showTitle?: boolean
  columns?: number
  gap?: string
  apiEndpoint?: string
  apiParams?: Record<string, any>
  apiResponsePath?: string
  cardType?: string
  cardProps?: Record<string, any>
  cardStyle?: 'default' | 'minimal' | 'bordered' | 'elevated'
  hoverEffect?: 'none' | 'lift' | 'zoom' | 'glow'
  enablePagination?: boolean
  itemsPerPage?: number
  columnsMobile?: number
  columnsTablet?: number
  columnsDesktop?: number
  className?: string
}

export default function GridWithAPI({
  title,
  subtitle,
  showTitle = true,
  gap = '24',
  apiEndpoint = '',
  apiParams = {},
  apiResponsePath = 'data.items',
  cardType = 'BlogCard',
  cardStyle = 'default',
  hoverEffect = 'lift',
  enablePagination = false,
  itemsPerPage = 10,
  columnsMobile = 1,
  columnsTablet = 2,
  columnsDesktop = 3,
  className
}: GridWithAPIProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Build API URL with params
  const buildApiUrl = () => {
    if (!apiEndpoint) return null

    const params: Record<string, any> = {
      ...apiParams,
      ...(enablePagination && {
        page: currentPage,
        limit: itemsPerPage
      })
    }

    return appendQueryParams(apiEndpoint, params)
  }
  const { data, loading, error } = useAsync<any>(apiEndpoint ? buildApiUrl : null)
  console.log('data', data)
  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'hover:-translate-y-2 hover:shadow-xl'
      case 'zoom':
        return 'hover:scale-105'
      case 'glow':
        return 'hover:shadow-2xl hover:shadow-primary/20'
      default:
        return ''
    }
  }

  const getCardClass = () => {
    const base = 'bg-white rounded-lg overflow-hidden transition-all duration-300'
    const hover = getHoverClass()
    switch (cardStyle) {
      case 'minimal':
        return `${base} ${hover}`
      case 'bordered':
        return `${base} border-2 ${hover}`
      case 'elevated':
        return `${base} shadow-lg ${hover}`
      default:
        return `${base} border ${hover}`
    }
  }

  // Get responsive grid classes
  const getGridClasses = () => {
    return cn(
      'grid',
      `grid-cols-${columnsMobile}`,
      `md:grid-cols-${columnsTablet}`,
      `lg:grid-cols-${columnsDesktop}`
    )
  }

  // Render card based on cardType
  const renderCard = (item: any, index: number) => {
    switch (cardType) {
      case 'BlogCard':
        return <BlogCard key={item.id || index} post={item} index={index} />

      case 'TestimonialCard':
        return <TestimonialCard key={item.id || index} item={item} />

      // Add more card types as needed
      default:
        // Generic card fallback
        return (
          <div key={item.id || index} className={getCardClass()}>
            <div className='space-y-4 p-6'>
              <Typography variant='h5' weight='semibold'>
                {item.title || item.name || 'Untitled'}
              </Typography>
              <Typography variant='body2' className='text-gray-600'>
                {item.excerpt || item.description || 'No description available'}
              </Typography>
            </div>
          </div>
        )
    }
  }

  // Extract items from response (handle different response structures)
  const getItems = () => {
    if (!data) return []

    // If custom response path is provided, use it
    if (apiResponsePath) {
      try {
        const pathParts = apiResponsePath.split('.')
        let result: any = data

        for (const part of pathParts) {
          if (result && typeof result === 'object' && part in result) {
            result = result[part]
          } else {
            // Path not found, fall back to default extraction
            break
          }
        }

        if (Array.isArray(result)) {
          return result
        }
      } catch (error) {
        console.warn('Failed to extract data using custom path:', apiResponsePath, error)
      }
    }

    // Fallback: Handle common response structures
    // Handle nested data.data.items structure
    if (data?.data?.items && Array.isArray(data.data.items)) {
      return data.data.items
    }

    // Handle paginated response data.data
    if (data?.data && Array.isArray(data.data)) {
      return data.data
    }

    // Handle direct array response
    if (Array.isArray(data)) {
      return data
    }

    // Handle nested data.items structure
    if (data?.items && Array.isArray(data.items)) {
      return data.items
    }

    return []
  }

  const items = getItems()

  // Extract pagination info with fallback to common paths
  const getTotalPages = () => {
    if (!data) return 1
    return data?.data?.totalPages || data?.totalPages || data?.pagination?.totalPages || 1
  }

  const getTotalItems = () => {
    if (!data) return items.length
    return data?.data?.total || data?.total || data?.pagination?.total || items.length
  }

  const totalPages = getTotalPages()
  const totalItems = getTotalItems()

  return (
    <div className={cn('space-y-6', className)}>
      {showTitle && title && (
        <div className='space-y-2 text-center'>
          <Typography variant='h3' weight='bold'>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant='body1' className='text-gray-600'>
              {subtitle}
            </Typography>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='w-8 h-8 text-primary animate-spin' />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='py-12 text-center'>
          <Typography variant='body1' className='text-red-600'>
            Failed to load data. Please try again later.
          </Typography>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className='py-12 text-center'>
          <Typography variant='body1' className='text-gray-500'>
            No items found.
          </Typography>
        </div>
      )}

      {/* Grid Items */}
      {!loading && !error && items.length > 0 && (
        <div
          className={getGridClasses()}
          style={{
            gap: `${gap}px`
          }}
        >
          {items.map((item: any, index: number) => renderCard(item, index))}
        </div>
      )}

      {/* Pagination */}
      {enablePagination && totalPages > 1 && !loading && (
        <div className='flex justify-center items-center gap-2 pt-6'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className='hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border rounded-lg disabled:cursor-not-allowed'
          >
            Previous
          </button>

          <div className='flex gap-2'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-colors',
                    currentPage === pageNum ? 'bg-primary text-white' : 'border hover:bg-gray-50'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className='hover:bg-gray-50 disabled:opacity-50 px-4 py-2 border rounded-lg disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}

      {/* Items count */}
      {!loading && items.length > 0 && (
        <div className='text-center'>
          <Typography variant='body2' className='text-gray-500'>
            Showing {items.length} of {totalItems} items
          </Typography>
        </div>
      )}
    </div>
  )
}
