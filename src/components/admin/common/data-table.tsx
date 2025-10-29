'use client'

import * as React from 'react'

export interface TableColumn<T = any> {
  key: string
  header: string | React.ReactNode
  render?: (value: any, data: T, index: number) => React.ReactNode
  width?: string
  className?: string
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage?: string
  className?: string
  getRowId?: (data: T) => number
}

export function CustomTable<T>({
  columns,
  data,
  emptyMessage = 'No results.',
  className = '',
  getRowId = (data: any) => data.id?.toString() || Math.random().toString()
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

    return value
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Table Container - prevents page overflow */}
      <div className='bg-background rounded-lg w-full overflow-hidden'>
        <div className='overflow-x-auto custom-scrollbar'>
          <table className='w-full'>
            <thead>
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`
                      px-2.5 py-2.5 text-left text-sm font-normal whitespace-nowrap font-manrope
                      border-y-2
                      ${column.className || ''}
                    `}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data?.map((item, rowIndex) => (
                  <tr key={getRowId(item)} className='group'>
                    {columns.map((column, idx) => (
                      <td
                        key={idx}
                        className={`px-2.5 py-2.5 text-sm whitespace-nowrap font-manrope border-b border-white/10 ${column.className || ''
                          }`}
                      >
                        <div className='min-w-0'>{renderCell(column, item, rowIndex)}</div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='px-4 py-8 text-sm'
                    style={{
                      fontFamily: 'Manrope',
                      fontSize: '14px'
                    }}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
