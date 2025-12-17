/**
 * Drag and Drop Context
 * @dnd-kit integration for page builder
 * Handles all drag and drop operations with performance optimization
 */

'use client'

import type { ComponentType, DraggableType } from '@/types/page-builder'
import {
    closestCenter,
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    pointerWithin,
    rectIntersection,
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
    // Sortable data (from @dnd-kit/sortable)
    sortable?: {
        containerId: string
        index: number
        items: string[]
    }
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
     * Custom collision detection
     * Prioritizes components over columns for better drop targeting
     */
    const customCollisionDetection: CollisionDetection = (args) => {
        // First, try pointer detection for precise targeting
        const pointerCollisions = pointerWithin(args)

        if (pointerCollisions.length > 0) {
            return pointerCollisions
        }

        // Then try rectangle intersection
        const intersectionCollisions = rectIntersection(args)
        if (intersectionCollisions.length > 0) {
            return intersectionCollisions
        }

        // Fall back to closest center
        return closestCenter(args)
    }

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

        console.log('[DnD] 🎯 Drag end event:', {
            active: active.id,
            over: over?.id,
            activeData: active.data.current,
            overData: over?.data.current
        })

        if (!over) {
            console.log('[DnD] ❌ No drop target (over is null)')
            setActiveDragData(null)
            return
        }

        const activeData = active.data.current as DragData
        const overData = over.data.current as DragData

        if (!activeData) {
            console.log('[DnD] ❌ No active data')
            setActiveDragData(null)
            return
        }

        // The ID comes from the sortable element, not from data
        const activeId = String(active.id)
        const overId = String(over.id)

        console.log('[DnD] 📦 Drag end details:', {
            activeType: activeData.type,
            overType: overData?.type,
            activeId: activeId,
            overId: overId
        })

        // ==================== ADDING NEW ELEMENTS ====================

        // Adding new component from sidebar
        if (
            activeData.type === 'component' &&
            activeData.componentType &&
            activeId.startsWith('new-') // New component from sidebar
        ) {
            console.log('[DnD] 🆕 New component drag detected:', { activeData, overData, overId })

            // Case 1: Dropping onto an existing component (insert at that position)
            if (overData?.type === 'component' && overData.columnId) {
                const targetColumnId = overData.columnId

                // Find the target component's index in its column
                let targetIndex = 0
                for (const section of content.sections) {
                    for (const row of section.rows) {
                        for (const column of row.columns) {
                            if (column.id === targetColumnId) {
                                targetIndex = column.components.findIndex((c) => c.id === overId)
                                break
                            }
                        }
                    }
                }

                const newComponent = componentRegistry.createInstance(
                    activeData.componentType,
                    generateId()
                )

                console.log('[DnD] ✅ Adding new component before existing component:', {
                    componentType: activeData.componentType,
                    columnId: targetColumnId,
                    targetIndex,
                    component: newComponent
                })

                addComponent(targetColumnId, newComponent, targetIndex)
                setActiveDragData(null)
                return
            }
            // Case 2: Dropping onto a column (append at the end)
            else if (overData?.type === 'column' && overData.columnId) {
                const newComponent = componentRegistry.createInstance(
                    activeData.componentType,
                    generateId()
                )
                console.log('[DnD] ✅ Adding new component to column (append):', {
                    componentType: activeData.componentType,
                    columnId: overData.columnId,
                    component: newComponent
                })
                addComponent(overData.columnId, newComponent)
                setActiveDragData(null)
                return
            }
            // Case 3: Check if overId matches pattern 'column-{id}' (for empty columns)
            else if (typeof overId === 'string' && overId.startsWith('column-')) {
                const columnId = overId.replace('column-', '')
                const newComponent = componentRegistry.createInstance(
                    activeData.componentType,
                    generateId()
                )
                console.log('[DnD] ✅ Adding new component to empty column:', {
                    componentType: activeData.componentType,
                    columnId: columnId,
                    overId: overId,
                    component: newComponent
                })
                addComponent(columnId, newComponent)
                setActiveDragData(null)
                return
            }
            else {
                console.log('[DnD] ❌ Cannot add component - invalid drop zone:', {
                    overData,
                    overType: overData?.type,
                    hasColumnId: !!overData?.columnId,
                    overId: overId
                })
            }
        }

        // ==================== MOVING EXISTING ELEMENTS ====================

        // Moving section
        if (activeData.type === 'section' && overData?.type === 'section') {
            console.log('[DnD] 🔵 Section drag detected')
            if (activeId !== overId) {
                // Find section positions in the array
                const activeIndex = content.sections.findIndex((s) => s.id === activeId)
                const overIndex = content.sections.findIndex((s) => s.id === overId)

                console.log('[DnD] Moving section from index', activeIndex, 'to', overIndex)

                if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
                    moveSection(activeId, overIndex)
                    console.log('[DnD] ✅ Section moved successfully')
                } else {
                    console.log('[DnD] ❌ Invalid section indices or same position')
                }
            } else {
                console.log('[DnD] ⚠️ Same section - no move needed')
            }
        }

        // Moving row
        if (activeData.type === 'row') {
            console.log('[DnD] 🟢 Row drag detected')
            // Find row and its current section
            let sourceSectionId: string | null = null
            for (const section of content.sections) {
                if (section.rows.some((r) => r.id === activeId)) {
                    sourceSectionId = section.id
                    break
                }
            }

            console.log('[DnD] Row source section:', sourceSectionId)

            if (sourceSectionId) {
                // Moving to another row position
                if (overData?.type === 'row') {
                    console.log('[DnD] Moving row to another row position')
                    // Find target section and row index
                    let targetSectionId: string | null = null
                    let targetRowIndex = 0

                    for (const section of content.sections) {
                        const rowIndex = section.rows.findIndex((r) => r.id === overId)
                        if (rowIndex !== -1) {
                            targetSectionId = section.id
                            targetRowIndex = rowIndex
                            break
                        }
                    }

                    if (targetSectionId && activeId !== overId) {
                        console.log('[DnD] Moving row', activeId, 'to section', targetSectionId, 'at index', targetRowIndex)
                        moveRow(activeId, targetSectionId, targetRowIndex)
                        console.log('[DnD] ✅ Row moved successfully')
                    } else {
                        console.log('[DnD] ⚠️ Same row or invalid target - no move needed')
                    }
                }
                // Moving to section (append)
                else if (overData?.type === 'section') {
                    console.log('[DnD] Moving row to section (append)')
                    const targetSection = content.sections.find((s) => s.id === overId)
                    if (targetSection) {
                        console.log('[DnD] Appending row to section', overId)
                        moveRow(activeId, overId, targetSection.rows.length)
                        console.log('[DnD] ✅ Row appended successfully')
                    }
                }
            } else {
                console.log('[DnD] ❌ Could not find source section for row')
            }
        }

        // Moving column
        if (activeData.type === 'column') {
            console.log('[DnD] 🟣 Column drag detected')
            // Find column and its current row
            let sourceRowId: string | null = null
            for (const section of content.sections) {
                for (const row of section.rows) {
                    if (row.columns.some((c) => c.id === activeId)) {
                        sourceRowId = row.id
                        break
                    }
                }
                if (sourceRowId) break
            }

            console.log('[DnD] Column source row:', sourceRowId)

            if (sourceRowId) {
                // Moving to another column position
                if (overData?.type === 'column') {
                    console.log('[DnD] Moving column to another column position')
                    // Find target row and column index
                    let targetRowId: string | null = null
                    let targetColumnIndex = 0

                    for (const section of content.sections) {
                        for (const row of section.rows) {
                            const columnIndex = row.columns.findIndex((c) => c.id === overId)
                            if (columnIndex !== -1) {
                                targetRowId = row.id
                                targetColumnIndex = columnIndex
                                break
                            }
                        }
                        if (targetRowId) break
                    }

                    if (targetRowId && activeId !== overId) {
                        console.log('[DnD] Moving column', activeId, 'to row', targetRowId, 'at index', targetColumnIndex)
                        moveColumn(activeId, targetRowId, targetColumnIndex)
                        console.log('[DnD] ✅ Column moved successfully')
                    } else {
                        console.log('[DnD] ⚠️ Same column or invalid target - no move needed')
                    }
                }
                // Moving to row (append)
                else if (overData?.type === 'row') {
                    console.log('[DnD] Moving column to row (append)')
                    const targetRow = content.sections
                        .flatMap((s) => s.rows)
                        .find((r) => r.id === overId)
                    if (targetRow) {
                        console.log('[DnD] Appending column to row', overId)
                        moveColumn(activeId, overId, targetRow.columns.length)
                        console.log('[DnD] ✅ Column appended successfully')
                    }
                }
            } else {
                console.log('[DnD] ❌ Could not find source row for column')
            }
        }

        // Moving component
        if (activeData.type === 'component' && !activeId.startsWith('new-')) {
            console.log('[DnD] 🟠 Component drag detected (existing component)')
            // Find component and its current column
            let sourceColumnId: string | null = null
            for (const section of content.sections) {
                for (const row of section.rows) {
                    for (const column of row.columns) {
                        if (column.components.some((c) => c.id === activeId)) {
                            sourceColumnId = column.id
                            break
                        }
                    }
                    if (sourceColumnId) break
                }
                if (sourceColumnId) break
            }

            console.log('[DnD] Component source column:', sourceColumnId)

            if (sourceColumnId) {
                // Moving to another component position
                if (overData?.type === 'component') {
                    console.log('[DnD] Moving component to another component position')

                    // Get target column ID from overData
                    const targetColumnId = overData.columnId || null

                    if (!targetColumnId) {
                        console.log('[DnD] ❌ No target column ID in overData')
                        setActiveDragData(null)
                        return
                    }

                    // Check if moving within same column
                    const isSameColumn = sourceColumnId === targetColumnId

                    // Find target component position in target column
                    let targetComponentIndex = 0
                    for (const section of content.sections) {
                        for (const row of section.rows) {
                            for (const column of row.columns) {
                                if (column.id === targetColumnId) {
                                    const componentIndex = column.components.findIndex((c) => c.id === overId)
                                    if (componentIndex !== -1) {
                                        targetComponentIndex = componentIndex
                                    }
                                    break
                                }
                            }
                        }
                    }

                    console.log('[DnD] Target component index:', targetComponentIndex)
                    console.log('[DnD] Same column?', isSameColumn)

                    if (targetColumnId && activeId !== overId) {
                        console.log('[DnD] ══════════════════════════════════════')
                        console.log('[DnD] 🎯 COMPONENT MOVE OPERATION')
                        console.log('[DnD] Active component ID:', activeId)
                        console.log('[DnD] Over component ID:', overId)
                        console.log('[DnD] Source column:', sourceColumnId)
                        console.log('[DnD] Target column:', targetColumnId)
                        console.log('[DnD] Target index:', targetComponentIndex)
                        console.log('[DnD] Same column:', sourceColumnId === targetColumnId)

                        // Get current positions before move
                        const sourceColumn = content.sections
                            .flatMap((s) => s.rows)
                            .flatMap((r) => r.columns)
                            .find((c) => c.id === sourceColumnId)
                        const targetColumn = content.sections
                            .flatMap((s) => s.rows)
                            .flatMap((r) => r.columns)
                            .find((c) => c.id === targetColumnId)

                        console.log('[DnD] Source column components:', sourceColumn?.components.map(c => ({ id: c.id, type: c.type, order: c.order })))
                        console.log('[DnD] Target column components:', targetColumn?.components.map(c => ({ id: c.id, type: c.type, order: c.order })))

                        moveComponent(activeId, targetColumnId, targetComponentIndex)

                        console.log('[DnD] ✅ Component moved successfully')
                        console.log('[DnD] ══════════════════════════════════════')
                    } else {
                        console.log('[DnD] ⚠️ Same component or invalid target - no move needed')
                    }
                }
                // Moving to column (append)
                else if (overData?.type === 'column' && overData.columnId) {
                    console.log('[DnD] Moving component to column (append)')
                    const targetColumn = content.sections
                        .flatMap((s) => s.rows)
                        .flatMap((r) => r.columns)
                        .find((c) => c.id === overData.columnId)
                    if (targetColumn) {
                        console.log('[DnD] Appending component to column', overData.columnId)
                        moveComponent(activeId, overData.columnId, targetColumn.components.length)
                        console.log('[DnD] ✅ Component appended successfully')
                    }
                }
            } else {
                console.log('[DnD] ❌ Could not find source column for component')
            }
        }

        setActiveDragData(null)
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <DndContextValue.Provider value={{ activeDragData }}>
                {children}
            </DndContextValue.Provider>

            {/* Drag overlay for visual feedback */}
            <DragOverlay dropAnimation={null}>
                {activeDragData ? (
                    <div className='bg-white shadow-2xl p-4 border-2 border-primary rounded-lg cursor-grabbing'>
                        <div className='flex items-center gap-3'>
                            {activeDragData.componentType && (
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
                            )}
                            <div>
                                <p className='font-semibold text-sm'>
                                    {activeDragData.componentType
                                        ? componentRegistry.get(activeDragData.componentType)?.label || activeDragData.componentType
                                        : activeDragData.type}
                                </p>
                                {activeDragData.componentType && (
                                    <p className='text-muted-foreground text-xs'>
                                        Drop into a column
                                    </p>
                                )}
                            </div>
                        </div>
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
