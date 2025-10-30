'use client'

import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import * as React from 'react'

export interface TableColumn<T = any> {
  key: string
  header: string | React.ReactNode
  render?: (value: any, data: T, index: number) => React.ReactNode
  width?: string
  className?: string
  sortable?: boolean
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage?: string
  emptyDescription?: string
  className?: string
  getRowId?: (data: T) => string | number
  loading?: boolean
  loadingRows?: number
  striped?: boolean
  compact?: boolean
}

export function CustomTable<T>({
  columns,
  data,
  emptyMessage = 'No data found',
  emptyDescription = 'There are no items to display at the moment.',
  className = '',
  getRowId = (data: any) => data.id?.toString() || Math.random().toString(),
  loading = false,
  loadingRows = 5,
  striped = false,
  compact = false
}: CustomTableProps<T>) {
  // Get cell value directly from data using column key
  const getCellValue = (data: T, column: TableColumn<T>) => {
    return (data as any)[column.key]
  }

  // Render cell content
  const renderCell = (column: TableColumn<T>, data: T, index: number) => {
    const value = getCellValue(data, column)

    if (column.render) {
      return column.render(value, data, index)
    }

    return value || '—'
  }

  // Loading skeleton rows
  const LoadingSkeleton = () => (
    <TableBody>
      {Array.from({ length: loadingRows }).map((_, index) => (
        <TableRow key={index} className='hover:bg-transparent'>
          {columns.map((column, colIndex) => (
            <TableCell key={colIndex} className={cn(compact ? 'py-2' : 'py-3')}>
              <Skeleton className='w-full max-w-[200px] h-4' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )

  // Empty state
  const EmptyTableState = () => (
    <TableBody>
      <TableRow className='hover:bg-transparent'>
        <TableCell colSpan={columns.length} className='p-0'>
          <div className='py-12'>
            <EmptyState
              title={emptyMessage}
              description={emptyDescription}
              variant='minimal'
              showImage={false}
              className='py-8'
            />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  )

  return (
    <div className={cn('space-y-4 w-full', className)}>
      <div className='bg-card shadow-sm border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b'>
              {columns.map((column, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    'h-12 font-semibold text-foreground/80',
                    compact ? 'px-3' : 'px-4',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  <div className='flex items-center gap-2'>
                    {column.header}
                    {column.sortable && (
                      <div className='opacity-50 ml-2 w-4 h-4'>
                        {/* Add sort icon here if needed */}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {loading ? (
            <LoadingSkeleton />
          ) : data?.length > 0 ? (
            <TableBody>
              {data.map((item, rowIndex) => (
                <TableRow
                  key={getRowId(item)}
                  className={cn(
                    'group transition-colors duration-200',
                    'hover:bg-muted/5',
                    striped && rowIndex % 2 === 1 && 'bg-muted/20',
                    'border-b border-border/40 last:border-0'
                  )}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        'font-medium text-foreground/90',
                        compact ? 'py-3 px-3' : 'py-4 px-4',
                        column.className
                      )}
                    >
                      <div className='flex items-center min-w-0'>
                        {renderCell(column, item, rowIndex)}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <EmptyTableState />
          )}
        </Table>
      </div>
    </div>
  )
}
