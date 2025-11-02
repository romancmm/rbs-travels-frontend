/**
 * Drag and Drop Context
 * @dnd-kit integration for page builder
 * Handles all drag and drop operations with performance optimization
 */

'use client'

import type { ComponentType, DraggableType } from '@/types/page-builder'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useBuilderStore } from './builder-store'
import { generateId } from './builder-utils'
import { componentRegistry } from './component-registry'

// ==================== TYPES ====================

interface DragData {
    id: string
    type: DraggableType
    componentType?: ComponentType
    parentId?: string
    sourceIndex?: number
    // For drop zones
    columnId?: string
    rowId?: string
    sectionId?: string
    accepts?: string[]
}

interface DndContextValue {
    activeDragData: DragData | null
}

// ==================== CONTEXT ====================

const DndContextValue = createContext<DndContextValue>({
    activeDragData: null,
})

export const useDnd = () => useContext(DndContextValue)

// ==================== PROVIDER ====================

interface BuilderDndProviderProps {
    children: ReactNode
}

export function BuilderDndProvider({ children }: BuilderDndProviderProps) {
    const {
        content,
        addSection,
        addRow,
        addColumn,
        addComponent,
        moveSection,
        moveRow,
        moveColumn,
        moveComponent,
    } = useBuilderStore()

    // Track active drag data
    const [activeDragData, setActiveDragData] = useState<DragData | null>(null)

    // Configure sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    /**
     * Handle drag start
     */
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const data = active.data.current as DragData

        if (!data) return

        setActiveDragData(data)

        // Visual feedback (can be handled by individual draggable components)
        console.log('[DnD] Drag started:', data)
    }

    /**
     * Handle drag over (for drop zone highlighting)
     */
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event

        if (!over) return

        const activeData = active.data.current as DragData
        const overData = over.data.current as DragData

        // Can add visual feedback here for valid/invalid drop zones
        console.log('[DnD] Drag over:', { activeData, overData })
    }

    /**
     * Handle drag end - perform the actual operation
     */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveDragData(null)
            return
        }

        const activeData = active.data.current as DragData
        const overData = over.data.current as DragData

        if (!activeData) {
            setActiveDragData(null)
            return
        }

        console.log('[DnD] Drag end:', { activeData, overData })

        // ==================== ADDING NEW ELEMENTS ====================

        // Adding new component from sidebar
        if (
            activeData.type === 'component' &&
            activeData.componentType &&
            activeData.id.startsWith('new-') // New component from sidebar
        ) {
            console.log('[DnD] New component drag detected:', { activeData, overData })
            if (overData?.type === 'column' && overData.columnId) {
                const newComponent = componentRegistry.createInstance(
                    activeData.componentType,
                    generateId()
                )
                console.log('[DnD] ✅ Adding new component to column:', {
                    componentType: activeData.componentType,
                    columnId: overData.columnId,
                    component: newComponent
                })
                addComponent(overData.columnId, newComponent)
                setActiveDragData(null)
                return
            } else {
                console.log('[DnD] ❌ Cannot add component - invalid drop zone:', { overData })
            }
        }

        // ==================== MOVING EXISTING ELEMENTS ====================

        // Moving section
        if (activeData.type === 'section' && overData?.type === 'section') {
            if (activeData.id !== overData.id) {
                const activeIndex = content.sections.findIndex((s) => s.id === activeData.id)
                const overIndex = content.sections.findIndex((s) => s.id === overData.id)

                if (activeIndex !== -1 && overIndex !== -1) {
                    moveSection(activeData.id, overIndex)
                }
            }
        }

        // Moving row
        if (activeData.type === 'row') {
            // Find row and its current section
            let sourceSectionId: string | null = null
            for (const section of content.sections) {
                if (section.rows.some((r) => r.id === activeData.id)) {
                    sourceSectionId = section.id
                    break
                }
            }

            if (sourceSectionId) {
                // Moving to another row position
                if (overData?.type === 'row') {
                    // Find target section
                    let targetSectionId: string | null = null
                    let targetRowIndex = 0

                    for (const section of content.sections) {
                        const rowIndex = section.rows.findIndex((r) => r.id === overData.id)
                        if (rowIndex !== -1) {
                            targetSectionId = section.id
                            targetRowIndex = rowIndex
                            break
                        }
                    }

                    if (targetSectionId && activeData.id !== overData.id) {
                        moveRow(activeData.id, targetSectionId, targetRowIndex)
                    }
                }
                // Moving to section (append)
                else if (overData?.type === 'section') {
                    const targetSection = content.sections.find((s) => s.id === overData.id)
                    if (targetSection) {
                        moveRow(activeData.id, overData.id, targetSection.rows.length)
                    }
                }
            }
        }

        // Moving column
        if (activeData.type === 'column') {
            // Find column and its current row
            let sourceRowId: string | null = null
            for (const section of content.sections) {
                for (const row of section.rows) {
                    if (row.columns.some((c) => c.id === activeData.id)) {
                        sourceRowId = row.id
                        break
                    }
                }
                if (sourceRowId) break
            }

            if (sourceRowId) {
                // Moving to another column position
                if (overData?.type === 'column') {
                    // Find target row
                    let targetRowId: string | null = null
                    let targetColumnIndex = 0

                    for (const section of content.sections) {
                        for (const row of section.rows) {
                            const columnIndex = row.columns.findIndex((c) => c.id === overData.id)
                            if (columnIndex !== -1) {
                                targetRowId = row.id
                                targetColumnIndex = columnIndex
                                break
                            }
                        }
                        if (targetRowId) break
                    }

                    if (targetRowId && activeData.id !== overData.id) {
                        moveColumn(activeData.id, targetRowId, targetColumnIndex)
                    }
                }
                // Moving to row (append)
                else if (overData?.type === 'row') {
                    const targetRow = content.sections
                        .flatMap((s) => s.rows)
                        .find((r) => r.id === overData.id)
                    if (targetRow) {
                        moveColumn(activeData.id, overData.id, targetRow.columns.length)
                    }
                }
            }
        }

        // Moving component
        if (activeData.type === 'component') {
            // Find component and its current column
            let sourceColumnId: string | null = null
            for (const section of content.sections) {
                for (const row of section.rows) {
                    for (const column of row.columns) {
                        if (column.components.some((c) => c.id === activeData.id)) {
                            sourceColumnId = column.id
                            break
                        }
                    }
                    if (sourceColumnId) break
                }
                if (sourceColumnId) break
            }

            if (sourceColumnId) {
                // Moving to another component position
                if (overData?.type === 'component') {
                    // Find target column
                    let targetColumnId: string | null = null
                    let targetComponentIndex = 0

                    for (const section of content.sections) {
                        for (const row of section.rows) {
                            for (const column of row.columns) {
                                const componentIndex = column.components.findIndex((c) => c.id === overData.id)
                                if (componentIndex !== -1) {
                                    targetColumnId = column.id
                                    targetComponentIndex = componentIndex
                                    break
                                }
                            }
                            if (targetColumnId) break
                        }
                        if (targetColumnId) break
                    }

                    if (targetColumnId && activeData.id !== overData.id) {
                        moveComponent(activeData.id, targetColumnId, targetComponentIndex)
                    }
                }
                // Moving to column (append)
                else if (overData?.type === 'column' && overData.columnId) {
                    const targetColumn = content.sections
                        .flatMap((s) => s.rows)
                        .flatMap((r) => r.columns)
                        .find((c) => c.id === overData.columnId)
                    if (targetColumn) {
                        moveComponent(activeData.id, overData.columnId, targetColumn.components.length)
                    }
                }
            }
        }

        setActiveDragData(null)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <DndContextValue.Provider value={{ activeDragData }}>
                {children}
            </DndContextValue.Provider>

            {/* Drag overlay for visual feedback */}
            <DragOverlay>
                {activeDragData ? (
                    <div className='bg-primary/10 shadow-lg p-4 border-2 border-primary border-dashed rounded-lg cursor-grabbing'>
                        <p className='font-medium text-sm'>
                            {activeDragData.type === 'component' && activeDragData.componentType
                                ? `${activeDragData.componentType} Component`
                                : `${activeDragData.type}`}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

// ==================== EXPORT UTILITIES ====================

/**
 * Create drag data for new component from sidebar
 */
export const createNewComponentDragData = (componentType: ComponentType): DragData => ({
    id: `new-${componentType}-${Date.now()}`,
    type: 'component',
    componentType,
})

/**
 * Create drag data for existing element
 */
export const createExistingElementDragData = (
    id: string,
    type: DraggableType,
    parentId?: string,
    sourceIndex?: number
): DragData => ({
    id,
    type,
    parentId,
    sourceIndex,
})
