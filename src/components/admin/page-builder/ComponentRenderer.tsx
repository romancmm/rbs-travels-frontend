'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Settings, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { componentRegistry } from '@/lib/page-builder/component-registry'
import { cn } from '@/lib/utils'
import type { BaseComponent } from '@/types/page-builder'

interface ComponentRendererProps {
    component: BaseComponent
    sectionId: string
    rowId: string
    columnId: string
}

export function ComponentRenderer({
    component,
    sectionId,
    rowId,
    columnId,
}: ComponentRendererProps) {
    const selectedId = useBuilderStore((state) => state.selection.selectedId)
    const hoveredId = useBuilderStore((state) => state.selection.hoveredId)
    const selectElement = useBuilderStore((state) => state.selectElement)
    const hoverElement = useBuilderStore((state) => state.hoverElement)
    const duplicateComponent = useBuilderStore((state) => state.duplicateComponent)
    const deleteComponent = useBuilderStore((state) => state.deleteComponent)

    const isSelected = selectedId === component.id
    const isHovered = hoveredId === component.id

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: component.id,
        data: {
            type: 'component',
            component,
            sectionId,
            rowId,
            columnId,
        },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    // Get component definition from registry
    const componentDef = componentRegistry.get(component.type)

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group/component relative transition-all duration-200',
                isDragging && 'opacity-50',
                isSelected && 'ring-2 ring-orange-500 ring-offset-2',
                isHovered && !isSelected && 'ring-2 ring-orange-300 ring-offset-2'
            )}
            onClick={(e) => {
                e.stopPropagation()
                selectElement(component.id, 'component')
            }}
            onMouseEnter={(e) => {
                e.stopPropagation()
                hoverElement(component.id, 'component')
            }}
            onMouseLeave={(e) => {
                e.stopPropagation()
                hoverElement(null)
            }}
        >
            {/* Component Toolbar - Shows on hover/select */}
            <div
                className={cn(
                    '-top-8 right-0 left-0 z-40 absolute flex items-center gap-2 opacity-0 transition-opacity',
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

                    {/* Component Label */}
                    <span className="px-2 font-medium text-gray-700 text-xs">
                        {componentDef?.label || component.type}
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
                        title="Component settings"
                    >
                        <Settings className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 w-7 h-7"
                        onClick={(e) => {
                            e.stopPropagation()
                            duplicateComponent(component.id)
                        }}
                        title="Duplicate component"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteComponent(component.id)
                        }}
                        title="Delete component"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            {/* Component Content Preview */}
            <div className="bg-white p-4 rounded">
                {componentDef ? (
                    <ComponentPreview component={component} definition={componentDef} />
                ) : (
                    <div className="text-gray-500 text-sm">
                        Unknown component: {component.type}
                    </div>
                )}
            </div>
        </div>
    )
}

/**
 * Component Preview
 * Renders a visual preview of the component based on its type and props
 */
function ComponentPreview({
    component,
    definition,
}: {
    component: BaseComponent
    definition: ReturnType<typeof componentRegistry.get>
}) {
    if (!definition) return null

    // Render based on component type
    switch (component.type) {
        case 'heading': {
            const { level = 'h2', text = 'Heading', alignment = 'left' } = component.props as any
            const className = cn(
                'font-bold',
                level === 'h1' && 'text-4xl',
                level === 'h2' && 'text-3xl',
                level === 'h3' && 'text-2xl',
                level === 'h4' && 'text-xl',
                level === 'h5' && 'text-lg',
                level === 'h6' && 'text-base',
                alignment === 'center' && 'text-center',
                alignment === 'right' && 'text-right'
            )

            if (level === 'h1') return <h1 className={className}>{text}</h1>
            if (level === 'h2') return <h2 className={className}>{text}</h2>
            if (level === 'h3') return <h3 className={className}>{text}</h3>
            if (level === 'h4') return <h4 className={className}>{text}</h4>
            if (level === 'h5') return <h5 className={className}>{text}</h5>
            if (level === 'h6') return <h6 className={className}>{text}</h6>
            return <h2 className={className}>{text}</h2>
        }

        case 'text': {
            const { text = 'Lorem ipsum dolor sit amet...', alignment = 'left' } = component.props as any
            return (
                <p
                    className={cn(
                        alignment === 'center' && 'text-center',
                        alignment === 'right' && 'text-right'
                    )}
                >
                    {text}
                </p>
            )
        }

        case 'button': {
            const {
                text = 'Button',
                variant = 'primary',
                size = 'medium',
                alignment = 'left',
            } = component.props as any

            return (
                <div
                    className={cn(
                        alignment === 'center' && 'text-center',
                        alignment === 'right' && 'text-right'
                    )}
                >
                    <button
                        className={cn(
                            'px-4 py-2 rounded font-medium transition-colors',
                            variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
                            variant === 'secondary' && 'bg-gray-600 text-white hover:bg-gray-700',
                            variant === 'outline' &&
                            'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
                            variant === 'ghost' && 'text-blue-600 hover:bg-blue-50',
                            variant === 'link' && 'text-blue-600 underline hover:text-blue-700',
                            size === 'small' && 'px-3 py-1 text-sm',
                            size === 'large' && 'px-6 py-3 text-lg'
                        )}
                    >
                        {text}
                    </button>
                </div>
            )
        }

        case 'image': {
            const { src, alt = 'Image', width, height } = component.props as any
            return (
                <div className="relative">
                    {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={src}
                            alt={alt}
                            width={width}
                            height={height}
                            className="max-w-full h-auto"
                        />
                    ) : (
                        <div className="flex justify-center items-center bg-gray-100 aspect-video">
                            <span className="text-gray-400 text-sm">No image</span>
                        </div>
                    )}
                </div>
            )
        }

        case 'video': {
            const { url, provider = 'youtube' } = component.props as any
            return (
                <div className="bg-gray-100 aspect-video">
                    {url ? (
                        <div className="flex justify-center items-center h-full">
                            <span className="text-gray-500 text-sm">
                                {provider === 'youtube' ? 'YouTube' : 'Vimeo'} Video: {url}
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <span className="text-gray-400 text-sm">No video URL</span>
                        </div>
                    )}
                </div>
            )
        }

        case 'spacer': {
            const { height = '40px' } = component.props as any
            return (
                <div style={{ height }} className="bg-gray-50">
                    <div className="flex justify-center items-center h-full">
                        <span className="text-gray-400 text-xs">Spacer ({height})</span>
                    </div>
                </div>
            )
        }

        case 'divider': {
            const { style = 'solid', color = '#e5e7eb', thickness = '1px' } = component.props as any
            return (
                <hr
                    style={{
                        borderStyle: style,
                        borderColor: color,
                        borderWidth: thickness,
                    }}
                    className="my-4"
                />
            )
        }

        default:
            return (
                <div className="text-gray-500 text-sm">
                    Component: {component.type}
                </div>
            )
    }
}
