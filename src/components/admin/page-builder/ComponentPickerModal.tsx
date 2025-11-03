/**
 * Component Picker Modal
 * Modal dialog for selecting a component to add to a column
 */

'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { generateId } from '@/lib/page-builder/builder-utils'
import { COMPONENT_CATEGORIES, componentRegistry } from '@/lib/page-builder/component-registry'
import { cn } from '@/lib/utils'
import type { ComponentDefinition } from '@/types/page-builder'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface ComponentPickerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    columnId: string
}

interface ComponentItemProps {
    component: ComponentDefinition
    onClick: () => void
}

function ComponentItem({ component, onClick }: ComponentItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'group flex items-start gap-3 bg-card hover:bg-accent p-3 border rounded-lg w-full text-left transition-all',
                'hover:scale-[1.02] hover:shadow-md'
            )}
        >
            <div className='bg-primary/10 group-hover:bg-primary/20 p-2 rounded transition-colors shrink-0'>
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

            <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-sm'>{component.label}</h4>
                <p className='text-muted-foreground text-xs line-clamp-2'>{component.description}</p>
                {component.tags && component.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                        {component.tags.map((tag) => (
                            <span
                                key={tag}
                                className='bg-primary/10 px-2 py-0.5 rounded-full text-[10px] text-primary'
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </button>
    )
}

export function ComponentPickerModal({ open, onOpenChange, columnId }: ComponentPickerModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const addComponent = useBuilderStore((state) => state.addComponent)

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

    const handleSelectComponent = (componentType: string) => {
        console.log('[ComponentPickerModal] Component selected:', { componentType, columnId })

        // Create new component instance
        const newComponent = componentRegistry.createInstance(componentType as any, generateId())

        console.log('[ComponentPickerModal] Adding component to column:', {
            columnId,
            component: newComponent
        })

        // Add to column
        addComponent(columnId, newComponent)

        // Close modal
        onOpenChange(false)

        // Reset search
        setSearchQuery('')
        setActiveCategory('all')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='flex flex-col max-w-3xl max-h-[80vh] overflow-hidden'>
                <DialogHeader>
                    <DialogTitle>Add Component</DialogTitle>
                    <DialogDescription>
                        Choose a component to add to your column. You can search or browse by category.
                    </DialogDescription>
                </DialogHeader>

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

                {/* Category Tabs & Components */}
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className='flex flex-col flex-1 overflow-hidden'>
                    <TabsList className='flex-wrap justify-start gap-1 bg-transparent w-full shrink-0'>
                        <TabsTrigger value='all' className='text-xs'>
                            All ({allComponents.length})
                        </TabsTrigger>
                        {COMPONENT_CATEGORIES.map((category) => {
                            const count = allComponents.filter((c) => c.category === category.id).length
                            return (
                                <TabsTrigger key={category.id} value={category.id} className='text-xs'>
                                    {category.label} ({count})
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>

                    {/* Components Grid */}
                    <TabsContent value={activeCategory} className='flex-1 mt-4 overflow-y-auto'>
                        {filteredComponents.length === 0 ? (
                            <div className='flex flex-col justify-center items-center py-12'>
                                <p className='text-muted-foreground text-sm'>No components found</p>
                                <p className='mt-1 text-muted-foreground text-xs'>
                                    Try a different search term or category
                                </p>
                            </div>
                        ) : (
                            <div className='gap-3 grid grid-cols-2 pb-4'>
                                {filteredComponents.map((component) => (
                                    <ComponentItem
                                        key={component.type}
                                        component={component}
                                        onClick={() => handleSelectComponent(component.type)}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className='flex justify-between items-center pt-4 border-t'>
                    <p className='text-muted-foreground text-xs'>
                        {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} available
                    </p>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
