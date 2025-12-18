'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { generateId } from '@/lib/page-builder/builder-utils'
import { componentRegistry } from '@/lib/page-builder/widgets'
import { cn } from '@/lib/utils'
import type { BaseComponent } from '@/types/page-builder'
import { ComponentPickerModal } from './ComponentPickerModal'
import { ComponentRenderer } from './ComponentRenderer'

interface GridItemRendererProps {
  gridItem: {
    id: string
    order: number
    components: BaseComponent[]
    settings?: {
      className?: string
      verticalAlign?: 'top' | 'center' | 'bottom' | 'stretch'
      horizontalAlign?: 'left' | 'center' | 'right'
    }
  }
  gridItemIndex: number
  gridComponentId: string
  sectionId: string
  rowId: string
  columnId: string
}

export function GridItemRenderer({
  gridItem,
  gridItemIndex,
  gridComponentId,
  sectionId,
  rowId,
  columnId
}: GridItemRendererProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const updateComponent = useBuilderStore((state) => state.updateComponent)
  const gridComponent = useBuilderStore((state) => {
    // Find the grid component to get its props
    const content = state.content
    for (const section of content.sections) {
      for (const row of section.rows) {
        for (const col of row.columns) {
          const comp = col.components.find((c) => c.id === gridComponentId)
          if (comp) return comp
        }
      }
    }
    return null
  })

  // Make grid item droppable for components
  const { setNodeRef, isOver } = useDroppable({
    id: `grid-item-${gridItem.id}`,
    data: {
      type: 'grid-item',
      gridItemId: gridItem.id,
      gridItemIndex,
      gridComponentId,
      sectionId,
      rowId,
      columnId,
      accepts: ['component']
    }
  })

  const componentIds = gridItem.components.map((component) => component.id)

  const handleAddComponent = (componentType: string) => {
    if (!gridComponent) return

    const gridItems = (gridComponent.props as any)?.gridItems || []
    const newComponent = componentRegistry.createInstance(componentType as any, generateId())

    const updatedGridItems = gridItems.map((item: any, index: number) => {
      if (index === gridItemIndex) {
        return {
          ...item,
          components: [...(item.components || []), newComponent]
        }
      }
      return item
    })

    updateComponent(gridComponentId, {
      props: {
        ...(gridComponent.props || {}),
        gridItems: updatedGridItems
      }
    })
  }

  const handleDeleteComponent = (componentId: string) => {
    if (!gridComponent) return

    const gridItems = (gridComponent.props as any)?.gridItems || []
    const updatedGridItems = gridItems.map((item: any, index: number) => {
      if (index === gridItemIndex) {
        return {
          ...item,
          components: item.components.filter((c: any) => c.id !== componentId)
        }
      }
      return item
    })

    updateComponent(gridComponentId, {
      props: {
        ...(gridComponent.props || {}),
        gridItems: updatedGridItems
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'group/griditem relative border-2 border-gray-300 border-dashed rounded-lg min-h-[120px] transition-all duration-200',
        isOver && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50 border-blue-400'
      )}
    >
      {/* Grid Item Content */}
      <div
        className={cn(
          'relative bg-gray-50/50 p-3 rounded-lg w-full min-h-[120px] transition-all',
          isOver && 'bg-blue-50/50',
          gridItem.settings?.className
        )}
      >
        {/* Grid Item Toolbar - Shows on hover */}
        <div
          className={cn(
            '-top-8 right-0 left-0 z-30 absolute flex items-center gap-2 opacity-0 w-fit transition-opacity duration-200 pointer-events-none',
            'group-hover/griditem:opacity-100 group-hover/griditem:pointer-events-auto'
          )}
        >
          <div className='flex items-center gap-1 bg-white shadow-sm px-2 py-1 border rounded-md'>
            {/* Grid Item Label */}
            <span className='px-2 font-medium text-gray-700 text-xs'>Col {gridItemIndex + 1}</span>

            {/* Divider */}
            <div className='bg-gray-200 w-px h-4' />

            {/* Component count badge */}
            <span className='bg-blue-100 px-2 py-0.5 rounded font-medium text-[10px] text-blue-700'>
              {gridItem.components?.length || 0} components
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
                // TODO: Could open grid item settings
              }}
              title='Grid item settings'
            >
              <Settings className='w-3.5 h-3.5' />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='gap-1 px-2 h-7 text-blue-600 hover:text-blue-700'
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
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
          onSelectComponent={handleAddComponent}
        />

        {/* Components */}
        {gridItem.components.length === 0 ? (
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
                  isOver ? 'text-blue-700' : 'text-gray-600'
                )}
              >
                {isOver ? 'Drop to add component' : 'Click + to add components'}
              </span>
            </div>
          </div>
        ) : (
          <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
            <div className={cn('space-y-3 min-h-[120px]', isOver && 'bg-blue-50/30')}>
              {gridItem.components.map((component) => (
                <div key={component.id} className='group/component-wrapper relative'>
                  <ComponentRenderer
                    component={component}
                    sectionId={sectionId}
                    rowId={rowId}
                    columnId={columnId}
                  />
                  {/* Delete button for components in grid items */}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='top-1 right-1 absolute hover:bg-red-50 opacity-0 group-hover/component-wrapper:opacity-100 p-1 w-6 h-6 text-red-600 hover:text-red-700 transition-opacity'
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteComponent(component.id)
                    }}
                    title='Remove from grid item'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                  </Button>
                </div>
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
