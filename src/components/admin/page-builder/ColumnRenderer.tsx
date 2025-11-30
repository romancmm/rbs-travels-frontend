'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Plus, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { cn } from '@/lib/utils'
import type { Column } from '@/types/page-builder'
import { ComponentPickerModal } from './ComponentPickerModal'
import { ComponentRenderer } from './ComponentRenderer'

interface ColumnRendererProps {
  column: Column
  sectionId: string
  rowId: string
}

export function ColumnRenderer({ column, sectionId, rowId }: ColumnRendererProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const selectedId = useBuilderStore((state) => state.selection.selectedId)
  const hoveredId = useBuilderStore((state) => state.selection.hoveredId)
  const selectElement = useBuilderStore((state) => state.selectElement)
  const hoverElement = useBuilderStore((state) => state.hoverElement)
  const deleteColumn = useBuilderStore((state) => state.deleteColumn)

  const isSelected = selectedId === column.id
  const isHovered = hoveredId === column.id

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
      sectionId,
      rowId
    }
  })

  // Make column droppable for components
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      columnId: column.id,
      sectionId,
      rowId,
      accepts: ['component']
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const componentIds = column.components.map((component) => component.id)

  return (
    <div
      ref={(node) => {
        setSortableRef(node)
        setDroppableRef(node)
      }}
      style={{
        ...style,
        flex: `0 0 calc(${(column.width / 12) * 100}% - 1rem)`,
        maxWidth: `calc(${(column.width / 12) * 100}% - 1rem)`
      }}
      className={cn(
        'group/column relative border-2 border-gray-300 border-dashed transition-all duration-200',
        isDragging && 'opacity-50',
        isSelected && 'ring-2 ring-purple-500 ring-offset-2 border-purple-400',
        isHovered && !isSelected && 'ring-2 ring-purple-300 ring-offset-2 border-purple-300',
        isOver && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50 border-blue-400'
      )}
      onMouseEnter={(e) => {
        e.stopPropagation()
        hoverElement(column.id, 'column')
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        hoverElement(null)
      }}
    >
      {/* Column Content */}
      <div
        className={cn(
          'relative bg-gray-50/50 px-2 py-10! rounded-lg w-full min-h-[120px] transition-all',
          isOver && 'bg-blue-50/50 ring-2 ring-blue-400 ring-inset',
          column.settings?.className
        )}
      >
        {/* Column Toolbar - Shows on hover/select */}
        <div
          className={cn(
            // base: positioned off-screen / invisible and non-interactive
            'absolute left-0 right-0 top-6 z-0 flex items-center gap-2 w-fit transition-all duration-200 pointer-events-none opacity-0',

            // show on named group hover (Tailwind named group syntax)
            'group/column-hover:top-2 group/column-hover:opacity-100 group/column-hover:z-30 group/column-hover:pointer-events-auto',

            // also force visible / interactive when hovered/selected via state
            (isHovered || isSelected) && 'opacity-100 -top-9 z-30 pointer-events-auto'
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

            {/* Column Label */}
            <span className='px-2 font-medium text-gray-700 text-xs'>
              Column ({column.width}/12)
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
                selectElement(column.id, 'column')
              }}
              title='Column settings'
            >
              <Settings className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='p-0 w-7 h-7'
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implement duplicate column
              }}
              title='Duplicate column'
            >
              <Copy className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700'
              onClick={(e) => {
                e.stopPropagation()
                deleteColumn(column.id)
              }}
              title='Delete column'
            >
              <Trash2 className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='gap-1 px-2 h-7 text-blue-600 hover:text-blue-700'
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                // console.log('[ColumnRenderer] Add component button clicked for column:', column.id)
                setIsPickerOpen(true)
              }}
              title='Add component'
            >
              <Plus className='w-3.5 h-3.5' />
              <span className='text-xs'>Add</span>
            </Button>
          </div>
        </div>

        {/* Component Picker Modal */}
        <ComponentPickerModal
          open={isPickerOpen}
          onOpenChange={setIsPickerOpen}
          columnId={column.id}
        />

        {/* Components */}
        {column.components.length === 0 ? (
          <div
            className={cn(
              'flex justify-center items-center w-full h-full min-h-[120px]',
              isOver && 'bg-blue-100 border-blue-400'
            )}
          >
            <div
              className={cn(
                'flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg min-h-20 text-center transition-all',
                isOver ? 'bg-blue-50 border-blue-400 scale-105' : 'bg-gray-50 border-gray-300'
              )}
            >
              <Plus
                className={cn(
                  'w-6 h-6 transition-colors',
                  isOver ? 'text-blue-500' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'font-medium text-xs transition-colors',
                  isOver ? 'text-red-700' : 'text-gray-600'
                )}
              >
                {isOver ? 'Drop to add component' : 'Drop component here...'}
              </span>
            </div>
          </div>
        ) : (
          <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            <div className={cn('space-y-3 p-2 min-h-[120px]', isOver && 'bg-blue-50/30')}>
              {column.components.map((component) => (
                <ComponentRenderer
                  key={component.id}
                  component={component}
                  sectionId={sectionId}
                  rowId={rowId}
                  columnId={column.id}
                />
              ))}

              {/* Drop zone at the end when dragging */}
              {isOver && (
                <div className='flex justify-center items-center bg-blue-50 py-4 border-2 border-blue-400 border-dashed rounded-lg'>
                  <span className='font-medium text-blue-600 text-xs'>
                    Drop here to add at the end
                  </span>
                </div>
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}
