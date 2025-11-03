'use client'

import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

import FileUploader from '@/components/common/FileUploader'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { findElementById } from '@/lib/page-builder/builder-utils'
import { componentRegistry } from '@/lib/page-builder/component-registry'
import type { BaseComponent } from '@/types/page-builder'

export function PropertiesPanel() {
    const selectedId = useBuilderStore((state) => state.selection.selectedId)
    const selectedType = useBuilderStore((state) => state.selection.selectedType)
    const rightPanelOpen = useBuilderStore((state) => state.ui.rightPanelOpen)
    const content = useBuilderStore((state) => state.content)
    const updateComponent = useBuilderStore((state) => state.updateComponent)

    if (!rightPanelOpen) return null

    // Find the selected element
    const selectedElement = selectedId ? findElementById(content, selectedId) : null

    console.log('[PropertiesPanel] Selected element:', {
        selectedId,
        selectedType,
        selectedElement,
        elementType: selectedElement?.type,
        hasElement: !!selectedElement?.element
    })

    return (
        <div className='bg-white border-l w-80 shrink-0'>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <div className='flex justify-between items-center px-4 border-b h-14'>
                    <div className='flex items-center gap-2'>
                        <Settings className='w-4 h-4 text-gray-500' />
                        <h2 className='font-semibold text-gray-900'>Properties</h2>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 p-4 overflow-auto'>
                    {selectedElement?.type === 'component' && selectedElement.element ? (
                        <ComponentProperties
                            component={selectedElement.element as BaseComponent}
                            onUpdate={(updates) => updateComponent(selectedId!, updates)}
                        />
                    ) : selectedId ? (
                        <div className='space-y-4'>
                            <div className='bg-gray-50 p-4 border rounded-lg'>
                                <p className='text-gray-600 text-sm'>
                                    Selected: <strong>{selectedType}</strong>
                                </p>
                                <p className='mt-1 text-gray-500 text-xs'>ID: {selectedId}</p>
                            </div>
                            <p className='text-muted-foreground text-sm'>
                                Properties for {selectedType} coming soon...
                            </p>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center py-12 text-center'>
                            <Settings className='w-8 h-8 text-gray-300' />
                            <p className='mt-4 font-medium text-gray-900 text-sm'>No element selected</p>
                            <p className='mt-1 text-gray-500 text-xs'>
                                Select an element to edit its properties
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ==================== COMPONENT PROPERTIES ====================

interface ComponentPropertiesProps {
    component: BaseComponent
    onUpdate: (updates: Partial<BaseComponent>) => void
}

function ComponentProperties({ component, onUpdate }: ComponentPropertiesProps) {
    const componentDef = componentRegistry.get(component.type)
    const [localProps, setLocalProps] = useState(component.props)

    // Update local props when component changes
    useEffect(() => {
        setLocalProps(component.props)
    }, [component])

    const handlePropChange = (key: string, value: any) => {
        const newProps = { ...localProps, [key]: value }
        setLocalProps(newProps)
        onUpdate({ props: newProps })
    }

    return (
        <div className='space-y-6'>
            {/* Component Info */}
            <div className='bg-primary/5 p-3 border rounded-lg'>
                <p className='font-medium text-sm'>{componentDef?.label || component.type}</p>
                <p className='mt-1 text-muted-foreground text-xs'>{componentDef?.description}</p>
            </div>

            {/* Component-specific properties */}
            {component.type === 'heading' && (
                <HeadingProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'text' && (
                <TextProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'button' && (
                <ButtonProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'image' && (
                <ImageProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'video' && (
                <VideoProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'spacer' && (
                <SpacerProperties props={localProps} onChange={handlePropChange} />
            )}

            {component.type === 'divider' && (
                <DividerProperties props={localProps} onChange={handlePropChange} />
            )}
        </div>
    )
}

// ==================== HEADING PROPERTIES ====================

function HeadingProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Text</Label>
                <Input
                    value={props.text || ''}
                    onChange={(e) => onChange('text', e.target.value)}
                    placeholder='Enter heading text'
                />
            </div>

            <div>
                <Label>Level</Label>
                <Select value={props.level || 'h2'} onValueChange={(value) => onChange('level', value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='h1'>H1 - Largest</SelectItem>
                        <SelectItem value='h2'>H2</SelectItem>
                        <SelectItem value='h3'>H3</SelectItem>
                        <SelectItem value='h4'>H4</SelectItem>
                        <SelectItem value='h5'>H5</SelectItem>
                        <SelectItem value='h6'>H6 - Smallest</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Alignment</Label>
                <Select
                    value={props.alignment || 'left'}
                    onValueChange={(value) => onChange('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='left'>Left</SelectItem>
                        <SelectItem value='center'>Center</SelectItem>
                        <SelectItem value='right'>Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

// ==================== TEXT PROPERTIES ====================

function TextProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Text Content</Label>
                <Textarea
                    value={props.text || ''}
                    onChange={(e) => onChange('text', e.target.value)}
                    placeholder='Enter your text here...'
                    rows={6}
                />
            </div>

            <div>
                <Label>Alignment</Label>
                <Select
                    value={props.alignment || 'left'}
                    onValueChange={(value) => onChange('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='left'>Left</SelectItem>
                        <SelectItem value='center'>Center</SelectItem>
                        <SelectItem value='right'>Right</SelectItem>
                        <SelectItem value='justify'>Justify</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

// ==================== BUTTON PROPERTIES ====================

function ButtonProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Button Text</Label>
                <Input
                    value={props.text || ''}
                    onChange={(e) => onChange('text', e.target.value)}
                    placeholder='Click here'
                />
            </div>

            <div>
                <Label>Link URL</Label>
                <Input
                    value={props.url || ''}
                    onChange={(e) => onChange('url', e.target.value)}
                    placeholder='https://example.com'
                    type='url'
                />
            </div>

            <div>
                <Label>Variant</Label>
                <Select
                    value={props.variant || 'primary'}
                    onValueChange={(value) => onChange('variant', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='primary'>Primary</SelectItem>
                        <SelectItem value='secondary'>Secondary</SelectItem>
                        <SelectItem value='outline'>Outline</SelectItem>
                        <SelectItem value='ghost'>Ghost</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Size</Label>
                <Select value={props.size || 'medium'} onValueChange={(value) => onChange('size', value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='small'>Small</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='large'>Large</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Alignment</Label>
                <Select
                    value={props.alignment || 'left'}
                    onValueChange={(value) => onChange('alignment', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='left'>Left</SelectItem>
                        <SelectItem value='center'>Center</SelectItem>
                        <SelectItem value='right'>Right</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

// ==================== IMAGE PROPERTIES ====================

function ImageProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Image</Label>
                <FileUploader
                    value={props.src || ''}
                    onChangeAction={(url) => onChange('src', url)}
                    multiple={false}
                    maxAllow={1}
                    size='large'
                />
                {props.src && (
                    <div className='mt-2'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={props.src}
                            alt={props.alt || 'Preview'}
                            className='border rounded w-full h-auto'
                        />
                    </div>
                )}
            </div>

            <div>
                <Label>Alt Text</Label>
                <Input
                    value={props.alt || ''}
                    onChange={(e) => onChange('alt', e.target.value)}
                    placeholder='Describe the image'
                />
                <p className='mt-1 text-muted-foreground text-xs'>
                    Important for accessibility and SEO
                </p>
            </div>

            <div>
                <Label>Width</Label>
                <Input
                    value={props.width || ''}
                    onChange={(e) => onChange('width', e.target.value)}
                    placeholder='auto, 100%, 500px'
                />
            </div>

            <div>
                <Label>Height</Label>
                <Input
                    value={props.height || ''}
                    onChange={(e) => onChange('height', e.target.value)}
                    placeholder='auto, 100%, 300px'
                />
            </div>
        </div>
    )
}

// ==================== VIDEO PROPERTIES ====================

function VideoProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Video URL</Label>
                <Input
                    value={props.url || ''}
                    onChange={(e) => onChange('url', e.target.value)}
                    placeholder='https://youtube.com/watch?v=...'
                    type='url'
                />
                <p className='mt-1 text-muted-foreground text-xs'>
                    YouTube, Vimeo, or direct video URL
                </p>
            </div>

            <div>
                <Label>Provider</Label>
                <Select
                    value={props.provider || 'youtube'}
                    onValueChange={(value) => onChange('provider', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='youtube'>YouTube</SelectItem>
                        <SelectItem value='vimeo'>Vimeo</SelectItem>
                        <SelectItem value='direct'>Direct URL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Aspect Ratio</Label>
                <Select
                    value={props.aspectRatio || '16/9'}
                    onValueChange={(value) => onChange('aspectRatio', value)}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='16/9'>16:9 (Widescreen)</SelectItem>
                        <SelectItem value='4/3'>4:3 (Standard)</SelectItem>
                        <SelectItem value='1/1'>1:1 (Square)</SelectItem>
                        <SelectItem value='21/9'>21:9 (Ultrawide)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

// ==================== SPACER PROPERTIES ====================

function SpacerProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Height</Label>
                <Input
                    value={props.height || '40px'}
                    onChange={(e) => onChange('height', e.target.value)}
                    placeholder='40px, 2rem, 10vh'
                />
                <p className='mt-1 text-muted-foreground text-xs'>
                    Use px, rem, em, vh, or other CSS units
                </p>
            </div>
        </div>
    )
}

// ==================== DIVIDER PROPERTIES ====================

function DividerProperties({ props, onChange }: any) {
    return (
        <div className='space-y-4'>
            <div>
                <Label>Style</Label>
                <Select value={props.style || 'solid'} onValueChange={(value) => onChange('style', value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='solid'>Solid</SelectItem>
                        <SelectItem value='dashed'>Dashed</SelectItem>
                        <SelectItem value='dotted'>Dotted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Color</Label>
                <Input
                    value={props.color || '#e5e7eb'}
                    onChange={(e) => onChange('color', e.target.value)}
                    type='color'
                />
            </div>

            <div>
                <Label>Thickness</Label>
                <Input
                    value={props.thickness || '1px'}
                    onChange={(e) => onChange('thickness', e.target.value)}
                    placeholder='1px, 2px, 0.5rem'
                />
            </div>
        </div>
    )
}
