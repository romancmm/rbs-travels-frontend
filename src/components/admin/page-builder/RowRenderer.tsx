'use client'

import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Columns, Copy, GripVertical, Settings, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { generateId } from '@/lib/page-builder/builder-utils'
import { cn } from '@/lib/utils'
import type { Column, Row } from '@/types/page-builder'
import { ColumnRenderer } from './ColumnRenderer'

interface RowRendererProps {
  row: Row
  sectionId: string
}

export function RowRenderer({ row, sectionId }: RowRendererProps) {
  const selectedId = useBuilderStore((state) => state.selection.selectedId)
  const hoveredId = useBuilderStore((state) => state.selection.hoveredId)
  const selectElement = useBuilderStore((state) => state.selectElement)
  const hoverElement = useBuilderStore((state) => state.hoverElement)
  const deleteRow = useBuilderStore((state) => state.deleteRow)
  const addColumn = useBuilderStore((state) => state.addColumn)
  const updateColumn = useBuilderStore((state) => state.updateColumn)

  const isSelected = selectedId === row.id
  const isHovered = hoveredId === row.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
    data: {
      type: 'row',
      row,
      sectionId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const columnIds = row.columns.map((column) => column.id)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/row relative transition-all duration-200',
        isDragging && 'opacity-50',
        isSelected && 'ring-2 ring-green-500 ring-offset-2',
        isHovered && !isSelected && 'ring-2 ring-green-300 ring-offset-2'
      )}
      onMouseEnter={(e) => {
        e.stopPropagation()
        hoverElement(row.id, 'row')
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        hoverElement(null)
      }}
    >
      {/* Row Content */}
      <div
        className={cn(
          'group/row relative bg-white px-6 py-16 border-2 border-dashed w-full min-h-20 transition-colors',
          isSelected && 'border-green-400 bg-green-50/30',
          isHovered && !isSelected && 'border-green-200 bg-green-50/10',
          row.settings?.className
        )}
      >
        {/* Row Toolbar - Shows on hover/select */}
        <div
          className={cn(
            // base: positioned off-screen / invisible and non-interactive
            'absolute left-0 right-0 top-6 z-0 flex items-center gap-2 w-fit transition-all duration-200 pointer-events-none opacity-0',

            // show on named group hover (Tailwind named group syntax)
            'group/row-hover:top-2 group/row-hover:opacity-100 group/row-hover:z-20 group/row-hover:pointer-events-auto',

            // also force visible / interactive when hovered/selected via state
            (isHovered || isSelected) && 'opacity-100 -top-9 z-20 pointer-events-auto'
          )}
        >
          <div className='flex items-center gap-1 bg-white shadow-sm px-2 py-1 border rounded-md'>
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className='hover:bg-gray-100 p-1 cursor-grab active:cursor-grabbing'
              title='Drag to reorder'
            >
              <GripVertical className='w-4 h-4 text-gray-500' />
            </button>

            {/* Row Label */}
            <span className='px-2 font-medium text-gray-700 text-xs'>
              Row ({row.columns.length} {row.columns.length === 1 ? 'column' : 'columns'})
            </span>

            {/* Divider */}
            <div className='bg-gray-200 w-px h-4' />

            {/* Actions */}
            <Button
              variant='ghost'
              size='sm'
              className='p-0 w-7 h-7'
              onClick={(e) => {
                e.stopPropagation()
                selectElement(row.id, 'row')
              }}
              title='Row settings'
            >
              <Settings className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='p-0 w-7 h-7'
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implement duplicate row
              }}
              title='Duplicate row'
            >
              <Copy className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700'
              onClick={(e) => {
                e.stopPropagation()
                deleteRow(row.id)
              }}
              title='Delete row'
            >
              <Trash2 className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='gap-1 px-2 h-7'
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()

                const currentColumnCount = row.columns.length
                const newColumnCount = currentColumnCount + 1

                if (newColumnCount > 12) {
                  console.warn('[RowRenderer] ❌ Cannot add column: maximum 12 columns reached')
                  alert('Cannot add column: maximum 12 columns per row')
                  return
                }

                const equalWidth = Math.floor(12 / newColumnCount)
                const remainder = 12 % newColumnCount

                row.columns.forEach((col, index) => {
                  const newWidth = equalWidth + (index < remainder ? 1 : 0)
                  updateColumn(col.id, { width: newWidth })
                })

                const newColumnWidth = equalWidth + (currentColumnCount < remainder ? 1 : 0)

                const newColumn: Column = {
                  id: generateId(),
                  width: newColumnWidth,
                  order: row.columns.length,
                  components: []
                }

                addColumn(row.id, newColumn)
              }}
              title={
                row.columns.length >= 12
                  ? 'Maximum 12 columns per row'
                  : `Add column (${row.columns.length + 1} columns = ${Math.floor(
                      12 / (row.columns.length + 1)
                    )} width each)`
              }
              disabled={row.columns.length >= 12}
            >
              <Columns className='w-3.5 h-3.5' />
              <span className='text-xs'>Add Column</span>
            </Button>
          </div>
        </div>

        {/* Columns */}
        {row.columns.length === 0 ? (
          <div className='flex justify-center items-center min-h-[150px]'>
            <button
              onClick={(e) => {
                e.stopPropagation()
                const newColumn: Column = {
                  id: generateId(),
                  width: 12, // First column gets full width
                  order: 0,
                  components: []
                }
                console.log('[RowRenderer] Adding first column to empty row:', {
                  rowId: row.id,
                  newColumn
                })
                addColumn(row.id, newColumn)
              }}
              className='flex flex-col items-center gap-2 bg-white hover:bg-green-50 p-6 border-2 border-gray-300 hover:border-green-400 border-dashed rounded-lg text-center transition-colors'
            >
              <Columns className='w-5 h-5 text-gray-400' />
              <span className='font-medium text-gray-600 text-sm'>Add Column to Row</span>
            </button>
          </div>
        ) : (
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            <div className='relative flex gap-4'>
              {row.columns.map((column) => (
                <ColumnRenderer
                  key={column.id}
                  column={column}
                  sectionId={sectionId}
                  rowId={row.id}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
