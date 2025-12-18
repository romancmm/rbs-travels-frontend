'use client'

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Plus, Settings, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { createRow } from '@/lib/page-builder/builder-utils'
import { cn } from '@/lib/utils'
import type { Section } from '@/types/page-builder'
import { RowRenderer } from './RowRenderer'

interface SectionRendererProps {
    section: Section
}

export function SectionRenderer({ section }: SectionRendererProps) {
    const selectedId = useBuilderStore((state) => state.selection.selectedId)
    const hoveredId = useBuilderStore((state) => state.selection.hoveredId)
    const selectElement = useBuilderStore((state) => state.selectElement)
    const hoverElement = useBuilderStore((state) => state.hoverElement)
    const duplicateSection = useBuilderStore((state) => state.duplicateSection)
    const deleteSection = useBuilderStore((state) => state.deleteSection)
    const addRow = useBuilderStore((state) => state.addRow)

    const isSelected = selectedId === section.id
    const isHovered = hoveredId === section.id

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: section.id,
        data: {
            type: 'section',
            section
        }
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const rowIds = section.rows.map((row) => row.id)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group/section relative border-2 border-dashed rounded-lg transition-all duration-200',
                isDragging && 'opacity-50',
                isSelected && 'ring-2 ring-blue-500 ring-offset-2 border-blue-400 bg-blue-50/20',
                isHovered &&
                !isSelected &&
                'ring-2 ring-blue-300 ring-offset-2 border-blue-300 bg-blue-50/10',
                !isSelected && !isHovered && 'border-gray-300 bg-gray-50/30'
            )}
            onMouseEnter={() => hoverElement(section.id, 'section')}
            onMouseLeave={() => hoverElement(null)}
        >
            {/* Section Content */}
            <div className={cn('relative p-4 w-full min-h-[100px]', section.settings?.className)}>
                {/* Section Toolbar - Shows on hover/select */}
                <div
                    className={cn(
                        // base: positioned off-screen / invisible and non-interactive
                        'absolute left-0 right-0 top-8 z-0 flex items-center gap-2 w-fit transition-all duration-200 pointer-events-none opacity-0',

                        // show on named group hover (Tailwind named group syntax)
                        'group/section-hover:top-4 group/section-hover:opacity-100 group/section-hover:z-10 group/section-hover:pointer-events-auto',

                        // also force visible / interactive when hovered/selected via state
                        (isHovered || isSelected) && 'opacity-100 -top-10 z-10 pointer-events-auto'
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

                        {/* Section Label */}
                        <span className='px-2 font-medium text-gray-700 text-xs'>Section</span>

                        {/* Divider */}
                        <div className='bg-gray-200 w-px h-4' />

                        {/* Actions */}
                        <Button
                            variant='ghost'
                            size='sm'
                            className='p-0 w-7 h-7'
                            onClick={(e) => {
                                e.stopPropagation()
                                selectElement(section.id, 'section')
                            }}
                            title='Section settings'
                        >
                            <Settings className='w-3.5 h-3.5' />
                        </Button>

                        <Button
                            variant='ghost'
                            size='sm'
                            className='p-0 w-7 h-7'
                            onClick={(e) => {
                                e.stopPropagation()
                                duplicateSection(section.id)
                            }}
                            title='Duplicate section'
                        >
                            <Copy className='w-3.5 h-3.5' />
                        </Button>

                        <Button
                            variant='ghost'
                            size='sm'
                            className='hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700'
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteSection(section.id)
                            }}
                            title='Delete section'
                        >
                            <Trash2 className='w-3.5 h-3.5' />
                        </Button>

                        <Button
                            variant='ghost'
                            size='sm'
                            className='gap-1 px-2 h-7'
                            onClick={(e) => {
                                e.stopPropagation()
                                const newRow = createRow([12])
                                addRow(section.id, newRow)
                            }}
                            title='Add row'
                        >
                            <Plus className='w-3.5 h-3.5' />
                            <span className='text-xs'>Add Row</span>
                        </Button>
                    </div>
                </div>

                {/* Rows */}
                {section.rows.length === 0 ? (
                    <div className='flex justify-center items-center min-h-[200px]'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                const newRow = createRow([12])
                                addRow(section.id, newRow)
                            }}
                            className='flex flex-col items-center gap-2 bg-white hover:bg-blue-50 p-8 border-2 border-gray-300 hover:border-blue-400 border-dashed rounded-lg text-center transition-colors'
                        >
                            <Plus className='w-6 h-6 text-gray-400' />
                            <span className='font-medium text-gray-600 text-sm'>Add Row to Section</span>
                        </button>
                    </div>
                ) : (
                    <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
                        <div className='space-y-4 p-4'>
                            {section.rows.map((row) => (
                                <RowRenderer key={row.id} row={row} sectionId={section.id} />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    )
}
