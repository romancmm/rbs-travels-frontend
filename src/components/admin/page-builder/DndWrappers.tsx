/**
 * Draggable and Droppable Wrappers
 * Reusable components for drag and drop functionality
 */

'use client'

import { cn } from '@/lib/utils'
import type { ComponentType, DraggableType } from '@/types/page-builder'
import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ReactNode } from 'react'

// ==================== DRAGGABLE WRAPPER ====================

interface DraggableWrapperProps {
    id: string
    type: DraggableType
    componentType?: ComponentType
    parentId?: string
    index?: number
    children: ReactNode
    disabled?: boolean
    className?: string
    handle?: boolean // If true, only a handle can initiate drag
}

export function DraggableWrapper({
    id,
    type,
    componentType,
    parentId,
    index,
    children,
    disabled = false,
    className,
    handle = false,
}: DraggableWrapperProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({
        id,
        data: {
            id,
            type,
            componentType,
            parentId,
            sourceIndex: index,
        },
        disabled,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative',
                isDragging && 'z-50',
                isOver && 'ring-2 ring-primary ring-offset-2',
                className
            )}
            {...(!handle ? attributes : {})}
            {...(!handle ? listeners : {})}
        >
            {children}

            {/* Drag handle if handle mode is enabled */}
            {handle && (
                <div
                    className='top-2 right-2 absolute bg-background hover:bg-accent p-1 border rounded cursor-grab active:cursor-grabbing'
                    {...attributes}
                    {...listeners}
                >
                    <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='text-muted-foreground'
                    >
                        <path
                            d='M5 3h1v1H5V3zm5 0h1v1h-1V3zM5 7h1v1H5V7zm5 0h1v1h-1V7zM5 11h1v1H5v-1zm5 0h1v1h-1v-1z'
                            fill='currentColor'
                        />
                    </svg>
                </div>
            )}
        </div>
    )
}

// ==================== DROPPABLE WRAPPER ====================

interface DroppableWrapperProps {
    id: string
    type: DraggableType
    children: ReactNode
    className?: string
    emptyMessage?: string
    disabled?: boolean
}

export function DroppableWrapper({
    id,
    type,
    children,
    className,
    emptyMessage = 'Drop here',
    disabled = false,
}: DroppableWrapperProps) {
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            id,
            type,
        },
        disabled,
    })

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'relative transition-colors',
                isOver && 'bg-primary/5 ring-2 ring-primary ring-dashed',
                className
            )}
        >
            {children}

            {/* Empty state with drop indicator */}
            {!children && (
                <div className='flex justify-center items-center border-2 border-dashed rounded-lg min-h-[120px]'>
                    <p className='text-muted-foreground text-sm'>{emptyMessage}</p>
                </div>
            )}
        </div>
    )
}

// ==================== SORTABLE CONTAINER ====================

interface SortableContainerProps {
    id: string
    children: ReactNode
    className?: string
    direction?: 'vertical' | 'horizontal'
}

export function SortableContainer({
    id,
    children,
    className,
    direction = 'vertical',
}: SortableContainerProps) {
    return (
        <div
            id={id}
            className={cn(
                'flex gap-2',
                direction === 'vertical' ? 'flex-col' : 'flex-row',
                className
            )}
        >
            {children}
        </div>
    )
}

// ==================== DROP INDICATOR ====================

interface DropIndicatorProps {
    isVisible: boolean
    position?: 'top' | 'bottom' | 'left' | 'right'
}

export function DropIndicator({ isVisible, position = 'bottom' }: DropIndicatorProps) {
    if (!isVisible) return null

    const isHorizontal = position === 'left' || position === 'right'

    return (
        <div
            className={cn(
                'z-50 absolute bg-primary',
                isHorizontal ? 'top-0 bottom-0 w-1' : 'left-0 right-0 h-1',
                position === 'top' && 'top-0',
                position === 'bottom' && 'bottom-0',
                position === 'left' && 'left-0',
                position === 'right' && 'right-0'
            )}
        />
    )
}

// ==================== COMPONENT DRAG PREVIEW ====================

interface ComponentDragPreviewProps {
    componentType: ComponentType
    label?: string
}

export function ComponentDragPreview({ componentType, label }: ComponentDragPreviewProps) {
    return (
        <div className='bg-white shadow-lg px-4 py-3 border rounded-lg cursor-grabbing'>
            <div className='flex items-center gap-2'>
                <div className='bg-primary/10 p-2 rounded'>
                    <svg
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                        className='text-primary'
                    >
                        <rect x='2' y='2' width='16' height='16' rx='2' stroke='currentColor' strokeWidth='2' />
                    </svg>
                </div>
                <div>
                    <p className='font-medium text-sm'>{label || componentType}</p>
                    <p className='text-muted-foreground text-xs'>Component</p>
                </div>
            </div>
        </div>
    )
}

// ==================== SECTION DRAG HANDLE ====================

export function SectionDragHandle() {
    return (
        <div className='flex flex-col gap-0.5 hover:bg-accent opacity-0 group-hover:opacity-100 p-2 rounded transition-opacity cursor-grab active:cursor-grabbing'>
            <div className='flex gap-0.5'>
                <div className='bg-current rounded-full w-1 h-1' />
                <div className='bg-current rounded-full w-1 h-1' />
            </div>
            <div className='flex gap-0.5'>
                <div className='bg-current rounded-full w-1 h-1' />
                <div className='bg-current rounded-full w-1 h-1' />
            </div>
        </div>
    )
}

// ==================== ROW DRAG HANDLE ====================

export function RowDragHandle() {
    return (
        <div className='hover:bg-accent opacity-0 group-hover:opacity-100 p-1.5 rounded transition-opacity cursor-grab active:cursor-grabbing'>
            <svg
                width='14'
                height='14'
                viewBox='0 0 14 14'
                fill='none'
                className='text-muted-foreground'
            >
                <circle cx='3' cy='3' r='1' fill='currentColor' />
                <circle cx='7' cy='3' r='1' fill='currentColor' />
                <circle cx='11' cy='3' r='1' fill='currentColor' />
                <circle cx='3' cy='7' r='1' fill='currentColor' />
                <circle cx='7' cy='7' r='1' fill='currentColor' />
                <circle cx='11' cy='7' r='1' fill='currentColor' />
                <circle cx='3' cy='11' r='1' fill='currentColor' />
                <circle cx='7' cy='11' r='1' fill='currentColor' />
                <circle cx='11' cy='11' r='1' fill='currentColor' />
            </svg>
        </div>
    )
}

// ==================== COLUMN DRAG HANDLE ====================

export function ColumnDragHandle() {
    return (
        <div className='hover:bg-accent opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity cursor-grab active:cursor-grabbing'>
            <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                className='text-muted-foreground'
            >
                <rect x='2' y='2' width='2' height='2' fill='currentColor' />
                <rect x='5' y='2' width='2' height='2' fill='currentColor' />
                <rect x='8' y='2' width='2' height='2' fill='currentColor' />
                <rect x='2' y='5' width='2' height='2' fill='currentColor' />
                <rect x='5' y='5' width='2' height='2' fill='currentColor' />
                <rect x='8' y='5' width='2' height='2' fill='currentColor' />
                <rect x='2' y='8' width='2' height='2' fill='currentColor' />
                <rect x='5' y='8' width='2' height='2' fill='currentColor' />
                <rect x='8' y='8' width='2' height='2' fill='currentColor' />
            </svg>
        </div>
    )
}

// ==================== COMPONENT DRAG HANDLE ====================

export function ComponentDragHandle() {
    return (
        <div className='hover:bg-accent opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity cursor-grab active:cursor-grabbing'>
            <svg
                width='10'
                height='10'
                viewBox='0 0 10 10'
                fill='none'
                className='text-muted-foreground'
            >
                <circle cx='2' cy='2' r='0.75' fill='currentColor' />
                <circle cx='5' cy='2' r='0.75' fill='currentColor' />
                <circle cx='8' cy='2' r='0.75' fill='currentColor' />
                <circle cx='2' cy='5' r='0.75' fill='currentColor' />
                <circle cx='5' cy='5' r='0.75' fill='currentColor' />
                <circle cx='8' cy='5' r='0.75' fill='currentColor' />
                <circle cx='2' cy='8' r='0.75' fill='currentColor' />
                <circle cx='5' cy='8' r='0.75' fill='currentColor' />
                <circle cx='8' cy='8' r='0.75' fill='currentColor' />
            </svg>
        </div>
    )
}
