'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Plus, Settings, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { cn } from '@/lib/utils'
import type { Column } from '@/types/page-builder'
import { ComponentRenderer } from './ComponentRenderer'

interface ColumnRendererProps {
    column: Column
    sectionId: string
    rowId: string
}

export function ColumnRenderer({ column, sectionId, rowId }: ColumnRendererProps) {
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
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'column',
            column,
            sectionId,
            rowId,
        },
    })

    // Make column droppable for components
    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: `column-${column.id}`,
        data: {
            type: 'column',
            columnId: column.id,
            sectionId,
            rowId,
            accepts: ['component'],
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const componentIds = column.components.map((component) => component.id)

    // Build inline styles from column settings
    const columnStyles: React.CSSProperties = {
        backgroundColor: column.settings?.background || undefined,
        backgroundImage: column.settings?.backgroundImage || undefined,
        paddingTop: column.settings?.padding?.top || undefined,
        paddingRight: column.settings?.padding?.right || undefined,
        paddingBottom: column.settings?.padding?.bottom || undefined,
        paddingLeft: column.settings?.padding?.left || undefined,
    }

    return (
        <div
            ref={(node) => {
                setSortableRef(node)
                setDroppableRef(node)
            }}
            style={style}
            className={cn(
                'group/column relative flex-1 transition-all duration-200',
                isDragging && 'opacity-50',
                isSelected && 'ring-2 ring-purple-500 ring-offset-2',
                isHovered && !isSelected && 'ring-2 ring-purple-300 ring-offset-2',
                isOver && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/50'
            )}
            onClick={(e) => {
                e.stopPropagation()
                selectElement(column.id, 'column')
            }}
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
                style={columnStyles}
                className={cn(
                    'relative w-full min-h-[120px]',
                    isOver && 'bg-blue-50/30'
                )}
            >
                {/* Column Toolbar - Shows on hover/select */}
                <div
                    className={cn(
                        '-top-9 right-0 left-0 z-30 absolute flex items-center gap-2 opacity-0 transition-opacity',
                        (isHovered || isSelected) && 'opacity-100'
                    )}
                >
                    <div className="flex items-center gap-1 bg-white shadow-sm px-2 py-1 border rounded-md">
                        {/* Drag Handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="hover:bg-gray-100 p-1 cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                        >
                            <GripVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Column Label */}
                        <span className="px-2 font-medium text-gray-700 text-xs">
                            Column
                        </span>

                        {/* Divider */}
                        <div className="bg-gray-200 w-px h-4" />

                        {/* Actions */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 w-7 h-7"
                            onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Open settings panel
                            }}
                            title="Column settings"
                        >
                            <Settings className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 w-7 h-7"
                            onClick={(e) => {
                                e.stopPropagation()
                                // TODO: Implement duplicate column
                            }}
                            title="Duplicate column"
                        >
                            <Copy className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700"
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteColumn(column.id)
                            }}
                            title="Delete column"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Components */}
                {column.components.length === 0 ? (
                    <div className={cn(
                        "flex justify-center items-center w-full h-full min-h-[120px]",
                        isOver && "bg-blue-100 border-blue-400"
                    )}>
                        <div className={cn(
                            "flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg text-center transition-all",
                            isOver ? "bg-blue-50 border-blue-400 scale-105" : "bg-gray-50 border-gray-300"
                        )}>
                            <Plus className={cn(
                                "w-6 h-6 transition-colors",
                                isOver ? "text-blue-500" : "text-gray-400"
                            )} />
                            <span className={cn(
                                "font-medium text-xs transition-colors",
                                isOver ? "text-blue-700" : "text-gray-600"
                            )}>
                                {isOver ? "Drop to add component" : "Drop component here"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <SortableContext items={componentIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3 p-2">
                            {column.components.map((component) => (
                                <ComponentRenderer
                                    key={component.id}
                                    component={component}
                                    sectionId={sectionId}
                                    rowId={rowId}
                                    columnId={column.id}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    )
}
