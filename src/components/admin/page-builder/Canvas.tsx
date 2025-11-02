'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { useBuilderContent } from '@/lib/page-builder/builder-store'
import { cn } from '@/lib/utils'
import { SectionRenderer } from './SectionRenderer'

export function Canvas() {
    const content = useBuilderContent()

    // Make canvas droppable for sections
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas-root',
        data: {
            type: 'canvas',
            accepts: ['section'],
        },
    })

    const sectionIds = content.sections.map((section) => section.id)

    return (
        <div className="flex justify-center items-center p-8 min-h-full">
            <div
                ref={setNodeRef}
                className={cn(
                    'relative w-full transition-all duration-200',
                    isOver && 'ring-2 ring-blue-500 ring-offset-4'
                )}
            >
                {/* Empty State */}
                {content.sections.length === 0 && (
                    <div className="flex flex-col justify-center items-center bg-white p-12 border-2 border-gray-300 border-dashed rounded-lg min-h-[500px] text-center">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="mt-4 font-semibold text-gray-900 text-lg">
                            Start building your page
                        </h3>
                        <p className="mt-2 max-w-sm text-gray-500 text-sm">
                            Drag components from the left sidebar to start creating your page layout.
                            You can also drag sections to organize your content.
                        </p>
                    </div>
                )}

                {/* Sections */}
                {content.sections.length > 0 && (
                    <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {content.sections.map((section) => (
                                <SectionRenderer key={section.id} section={section} />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    )
}
