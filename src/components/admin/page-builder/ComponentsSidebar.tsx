/**
 * Components Sidebar
 * Left panel showing draggable components
 */

'use client'

import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { COMPONENT_CATEGORIES, componentRegistry } from '@/lib/page-builder/widgets'
import { cn } from '@/lib/utils'
import type { ComponentDefinition } from '@/types/page-builder'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
    AlignLeft,
    BarChart3,
    Box,
    ChevronDown,
    Clock,
    DollarSign,
    Folder,
    GripVertical,
    HelpCircle,
    ImageIcon,
    Images,
    Mail,
    Map,
    MessageSquareQuote,
    Minus,
    MousePointerClick,
    Newspaper,
    Plane,
    Rss,
    Search,
    Share2,
    ShoppingBag,
    Square,
    Type,
    Video
} from 'lucide-react'
import { useState } from 'react'

// Icon mapping for component types
const ICON_MAP: Record<string, React.ComponentType<any>> = {
    Type,
    AlignLeft,
    MousePointerClick,
    ImageIcon,
    Square,
    Minus,
    Video,
    Images,
    Map,
    Mail,
    Search,
    Newspaper,
    ShoppingBag,
    Plane,
    MessageSquareQuote,
    HelpCircle,
    BarChart3,
    Share2,
    Rss,
    DollarSign,
    Box,
    Folder,
    ChevronDown,
    Clock
}

// ==================== DRAGGABLE COMPONENT ITEM ====================

interface DraggableComponentItemProps {
    component: ComponentDefinition
}

function DraggableComponentItem({ component }: DraggableComponentItemProps) {
    // Generate a stable unique ID for this draggable instance
    const [dragId] = useState(() => `new-${component.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: dragId,
        data: {
            id: dragId,
            type: 'component',
            componentType: component.type,
        },
    })

    const style: React.CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition: 'transform 200ms ease, opacity 200ms ease',
        opacity: isDragging ? 0.5 : 1,
    }

    // Log when dragging starts
    if (isDragging) {
        console.log('[ComponentsSidebar] 🎬 Dragging component:', {
            id: dragId,
            type: component.type,
            label: component.label
        })
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'group flex items-start gap-3 bg-card hover:bg-accent p-3 border rounded-lg cursor-grab active:cursor-grabbing',
                'transition-all duration-200 ease-in-out',
                isDragging && 'scale-[0.98] shadow-lg z-50'
            )}
        >
            {/* Drag Handle Icon */}
            <div className='opacity-40 group-hover:opacity-100 pt-0.5 text-muted-foreground transition-opacity shrink-0'>
                <GripVertical className='w-4 h-4' />
            </div>

            {/* Component Icon */}
            <div className='bg-primary/10 group-hover:bg-primary/20 p-2 rounded transition-colors shrink-0'>
                {(() => {
                    const IconComponent = ICON_MAP[component.icon]
                    if (IconComponent) {
                        return <IconComponent className='w-5 h-5 text-primary' />
                    }
                    return (
                        <svg
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                            className='text-primary'
                        >
                            <rect x='2' y='2' width='16' height='16' rx='2' stroke='currentColor' strokeWidth='2' />
                        </svg>
                    )
                })()}
            </div>

            <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-sm'>{component.label}</h4>
                <p className='text-muted-foreground text-xs line-clamp-2'>{component.description}</p>
            </div>
        </div>
    )
}

// ==================== COMPONENTS LIST ====================

interface ComponentsListProps {
    components: ComponentDefinition[]
}

function ComponentsList({ components }: ComponentsListProps) {
    if (components.length === 0) {
        return (
            <div className='flex justify-center items-center py-12'>
                <p className='text-muted-foreground text-sm'>No components found</p>
            </div>
        )
    }

    return (
        <div className='space-y-2'>
            {components.map((component) => (
                <DraggableComponentItem key={component.type} component={component} />
            ))}
        </div>
    )
}

// ==================== MAIN SIDEBAR ====================

export function ComponentsSidebar() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string>('all')

    // Get all components
    const allComponents = componentRegistry.getAll()

    // Filter components based on search and category
    const filteredComponents = allComponents.filter((component) => {
        const matchesSearch =
            searchQuery === '' ||
            component.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = activeCategory === 'all' || component.category === activeCategory

        return matchesSearch && matchesCategory
    })

    return (
        <div className='flex flex-col bg-background border-r w-[280px] h-full'>
            {/* Header */}
            <div className='space-y-4 p-4 border-b shrink-0'>
                <h2 className='font-semibold text-lg'>Components</h2>

                {/* Search */}
                <div className='relative'>
                    <Search className='top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground' />
                    <Input
                        placeholder='Search components...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-8'
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className='flex flex-col flex-1'>
                <TabsList className='flex-wrap justify-start gap-1 bg-transparent px-4 pt-4 w-full shrink-0'>
                    <TabsTrigger value='all' className='text-xs'>
                        All
                    </TabsTrigger>
                    {COMPONENT_CATEGORIES.map((category) => (
                        <TabsTrigger key={category.id} value={category.id} className='text-xs'>
                            {category.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Components List */}
                <div className='flex-1 overflow-y-auto'>
                    <TabsContent value={activeCategory} className='mt-0 p-4'>
                        <ComponentsList components={filteredComponents} />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Footer Info */}
            <div className='space-y-2 p-4 border-t shrink-0'>
                <p className='text-muted-foreground text-xs'>
                    💡 <strong>Drag components</strong> onto the canvas to build your page
                </p>
                <p className='text-[10px] text-muted-foreground'>
                    Drop onto columns to add new components
                </p>
            </div>
        </div>
    )
}
