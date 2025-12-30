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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { findElementById } from '@/lib/page-builder/builder-utils'
import { componentRegistry } from '@/lib/page-builder/component-registry'
import type { BaseComponent, Column, Row, Section } from '@/types/page-builder'

export function PropertiesPanel() {
  const selectedId = useBuilderStore((state) => state.selection.selectedId)
  const selectedType = useBuilderStore((state) => state.selection.selectedType)
  const rightPanelOpen = useBuilderStore((state) => state.ui.rightPanelOpen)
  const toggleRightPanel = useBuilderStore((state) => state.toggleRightPanel)
  const selectElement = useBuilderStore((state) => state.selectElement)
  const content = useBuilderStore((state) => state.content)
  const updateComponent = useBuilderStore((state) => state.updateComponent)
  const updateSection = useBuilderStore((state) => state.updateSection)
  const updateRow = useBuilderStore((state) => state.updateRow)
  const updateColumn = useBuilderStore((state) => state.updateColumn)

  // Find the selected element
  const selectedElement = selectedId ? findElementById(content, selectedId) : null

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Close the sheet and clear selection
      selectElement(null)
    }
  }

  // Get the title based on selected element type
  const getTitle = () => {
    if (!selectedElement) return 'Properties'
    switch (selectedElement.type) {
      case 'section':
        return 'Section Properties'
      case 'row':
        return 'Row Properties'
      case 'column':
        return 'Column Properties'
      case 'component':
        const componentDef = componentRegistry.get((selectedElement.element as BaseComponent)?.type)
        return `${componentDef?.label || 'Component'} Properties`
      default:
        return 'Properties'
    }
  }

  return (
    <Sheet open={rightPanelOpen && !!selectedId} onOpenChange={handleOpenChange}>
      <SheetContent side='right' className='w-[400px] sm:w-[500px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Settings className='w-5 h-5 text-gray-500' />
            {getTitle()}
          </SheetTitle>
          <SheetDescription>
            Configure the properties and styling for the selected element.
          </SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {selectedElement?.type === 'section' && selectedElement.element ? (
            <SectionProperties
              section={selectedElement.element}
              onUpdate={(updates: Partial<Section>) => updateSection(selectedId!, updates)}
            />
          ) : selectedElement?.type === 'row' && selectedElement.element ? (
            <RowProperties
              row={selectedElement.element}
              onUpdate={(updates: Partial<Row>) => updateRow(selectedId!, updates)}
            />
          ) : selectedElement?.type === 'column' && selectedElement.element ? (
            <ColumnProperties
              column={selectedElement.element}
              onUpdate={(updates: Partial<Column>) => updateColumn(selectedId!, updates)}
            />
          ) : selectedElement?.type === 'component' && selectedElement.element ? (
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
                Unable to load properties for {selectedType}
              </p>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center py-12 text-center'>
              <Settings className='w-8 h-8 text-gray-300' />
              <p className='mt-4 font-medium text-gray-900 text-sm'>No element selected</p>
              <p className='mt-1 text-gray-500 text-xs'>Select an element to edit its properties</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ==================== SECTION PROPERTIES ====================

function SectionProperties({ section, onUpdate }: any) {
  const [localSettings, setLocalSettings] = useState(section.settings || {})

  useEffect(() => {
    setLocalSettings(section.settings || {})
  }, [section])

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.')
    const newSettings = { ...localSettings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setLocalSettings(newSettings)
    onUpdate({ settings: newSettings })
  }

  return (
    <div className='space-y-6'>
      <div className='bg-blue-50 p-3 border border-blue-200 rounded-lg'>
        <p className='font-medium text-sm'>Section</p>
        <p className='mt-1 text-muted-foreground text-xs'>Configure section layout and styling</p>
      </div>

      {/* Section Name */}
      <div>
        <Label>Section Name</Label>
        <Input
          value={section.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder='Hero, Features, etc.'
        />
      </div>

      {/* Custom Class Name */}
      <div>
        <Label>Custom Classes</Label>
        <Input
          value={localSettings.className || ''}
          onChange={(e) => handleChange('className', e.target.value)}
          placeholder='custom-class another-class'
        />
        <p className='mt-1 text-muted-foreground text-xs'>Add custom Tailwind or CSS classes</p>
      </div>

      {/* Background */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Background</h3>
        <div>
          <Label>Background Color</Label>
          <Input
            type='color'
            value={localSettings.background?.color || '#ffffff'}
            onChange={(e) => handleChange('background.color', e.target.value)}
          />
        </div>
        <div>
          <Label>Background Image URL</Label>
          <Input
            value={localSettings.background?.image || ''}
            onChange={(e) => handleChange('background.image', e.target.value)}
            placeholder='https://example.com/image.jpg'
          />
        </div>
      </div>

      {/* Padding */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Padding</h3>
        <div className='gap-2 grid grid-cols-2'>
          <div>
            <Label>Top</Label>
            <Input
              value={localSettings.padding?.top || ''}
              onChange={(e) => handleChange('padding.top', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <Input
              value={localSettings.padding?.bottom || ''}
              onChange={(e) => handleChange('padding.bottom', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Left</Label>
            <Input
              value={localSettings.padding?.left || ''}
              onChange={(e) => handleChange('padding.left', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Right</Label>
            <Input
              value={localSettings.padding?.right || ''}
              onChange={(e) => handleChange('padding.right', e.target.value)}
              placeholder='0px'
            />
          </div>
        </div>
      </div>

      {/* Margin */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Margin</h3>
        <div className='gap-2 grid grid-cols-2'>
          <div>
            <Label>Top</Label>
            <Input
              value={localSettings.margin?.top || ''}
              onChange={(e) => handleChange('margin.top', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <Input
              value={localSettings.margin?.bottom || ''}
              onChange={(e) => handleChange('margin.bottom', e.target.value)}
              placeholder='0px'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== ROW PROPERTIES ====================

function RowProperties({ row, onUpdate }: any) {
  const [localSettings, setLocalSettings] = useState(row.settings || {})

  useEffect(() => {
    setLocalSettings(row.settings || {})
  }, [row])

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.')
    const newSettings = { ...localSettings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setLocalSettings(newSettings)
    onUpdate({ settings: newSettings })
  }

  return (
    <div className='space-y-6'>
      <div className='bg-green-50 p-3 border border-green-200 rounded-lg'>
        <p className='font-medium text-sm'>Row</p>
        <p className='mt-1 text-muted-foreground text-xs'>Configure row layout and spacing</p>
      </div>

      {/* Custom Class Name */}
      <div>
        <Label>Custom Classes</Label>
        <Input
          value={localSettings.className || ''}
          onChange={(e) => handleChange('className', e.target.value)}
          placeholder='custom-class another-class'
        />
        <p className='mt-1 text-muted-foreground text-xs'>Add custom Tailwind or CSS classes</p>
      </div>

      {/* Layout */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Layout</h3>
        <div>
          <Label>Columns Gap</Label>
          <Input
            value={localSettings.columnsGap || ''}
            onChange={(e) => handleChange('columnsGap', e.target.value)}
            placeholder='1rem, 16px'
          />
        </div>
        <div>
          <Label>Alignment</Label>
          <Select
            value={localSettings.alignment || 'left'}
            onValueChange={(value) => handleChange('alignment', value)}
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

      {/* Background */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Background</h3>
        <div>
          <Label>Background Color</Label>
          <Input
            type='color'
            value={localSettings.background || '#ffffff'}
            onChange={(e) => handleChange('background', e.target.value)}
          />
        </div>
      </div>

      {/* Padding */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Padding</h3>
        <div className='gap-2 grid grid-cols-2'>
          <div>
            <Label>Top</Label>
            <Input
              value={localSettings.padding?.top || ''}
              onChange={(e) => handleChange('padding.top', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <Input
              value={localSettings.padding?.bottom || ''}
              onChange={(e) => handleChange('padding.bottom', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Left</Label>
            <Input
              value={localSettings.padding?.left || ''}
              onChange={(e) => handleChange('padding.left', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Right</Label>
            <Input
              value={localSettings.padding?.right || ''}
              onChange={(e) => handleChange('padding.right', e.target.value)}
              placeholder='0px'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== COLUMN PROPERTIES ====================

function ColumnProperties({ column, onUpdate }: any) {
  const [localSettings, setLocalSettings] = useState(column.settings || {})

  useEffect(() => {
    setLocalSettings(column.settings || {})
  }, [column])

  const handleChange = (path: string, value: any) => {
    const keys = path.split('.')
    const newSettings = { ...localSettings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    setLocalSettings(newSettings)
    onUpdate({ settings: newSettings })
  }

  return (
    <div className='space-y-6'>
      <div className='bg-purple-50 p-3 border border-purple-200 rounded-lg'>
        <p className='font-medium text-sm'>Column ({column.width}/12)</p>
        <p className='mt-1 text-muted-foreground text-xs'>Configure column layout and styling</p>
      </div>

      {/* Custom Class Name */}
      <div>
        <Label>Custom Classes</Label>
        <Input
          value={localSettings.className || ''}
          onChange={(e) => handleChange('className', e.target.value)}
          placeholder='custom-class another-class'
        />
        <p className='mt-1 text-muted-foreground text-xs'>Add custom Tailwind or CSS classes</p>
      </div>

      {/* Layout */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Layout</h3>
        <div>
          <Label>Width (1-12)</Label>
          <Input
            type='number'
            min={1}
            max={12}
            value={column.width}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div>
          <Label>Vertical Align</Label>
          <Select
            value={localSettings.verticalAlign || 'top'}
            onValueChange={(value) => handleChange('verticalAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='top'>Top</SelectItem>
              <SelectItem value='center'>Center</SelectItem>
              <SelectItem value='bottom'>Bottom</SelectItem>
              <SelectItem value='stretch'>Stretch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Background */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Background</h3>
        <div>
          <Label>Background Color</Label>
          <Input
            type='color'
            value={localSettings.background || '#ffffff'}
            onChange={(e) => handleChange('background', e.target.value)}
          />
        </div>
      </div>

      {/* Padding */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Padding</h3>
        <div className='gap-2 grid grid-cols-2'>
          <div>
            <Label>Top</Label>
            <Input
              value={localSettings.padding?.top || ''}
              onChange={(e) => handleChange('padding.top', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Bottom</Label>
            <Input
              value={localSettings.padding?.bottom || ''}
              onChange={(e) => handleChange('padding.bottom', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Left</Label>
            <Input
              value={localSettings.padding?.left || ''}
              onChange={(e) => handleChange('padding.left', e.target.value)}
              placeholder='0px'
            />
          </div>
          <div>
            <Label>Right</Label>
            <Input
              value={localSettings.padding?.right || ''}
              onChange={(e) => handleChange('padding.right', e.target.value)}
              placeholder='0px'
            />
          </div>
        </div>
      </div>

      {/* Border */}
      <div className='space-y-3'>
        <h3 className='font-medium text-sm'>Border</h3>
        <div>
          <Label>Border</Label>
          <Input
            value={localSettings.border || ''}
            onChange={(e) => handleChange('border', e.target.value)}
            placeholder='1px solid #ccc'
          />
        </div>
        <div>
          <Label>Border Radius</Label>
          <Input
            value={localSettings.borderRadius || ''}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
            placeholder='4px, 0.5rem'
          />
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

      {/* Custom Class Name */}
      <div>
        <Label>Custom Classes</Label>
        <Input
          value={component.settings?.className || ''}
          onChange={(e) => {
            const newSettings = {
              ...(component.settings || {}),
              className: e.target.value
            }

            onUpdate({ settings: newSettings })
          }}
          placeholder='custom-class another-class'
        />
        <p className='mt-1 text-muted-foreground text-xs'>Add custom Tailwind or CSS classes</p>
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
          uploadPath='pages'
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
        <p className='mt-1 text-muted-foreground text-xs'>Important for accessibility and SEO</p>
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
  // Extract video ID from URL
  const getVideoEmbedUrl = (url: string, provider: string) => {
    if (!url) return null

    try {
      if (provider === 'youtube') {
        // Handle various YouTube URL formats
        let videoId = ''
        if (url.includes('youtube.com/watch?v=')) {
          videoId = url.split('v=')[1]?.split('&')[0]
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0]
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('embed/')[1]?.split('?')[0]
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      } else if (provider === 'vimeo') {
        // Handle Vimeo URLs
        const match = url.match(/vimeo\.com\/(\d+)/)
        return match ? `https://player.vimeo.com/video/${match[1]}` : null
      } else if (provider === 'direct') {
        // Direct video URL
        return url
      }
    } catch (error) {
      console.error('Error parsing video URL:', error)
    }
    return null
  }

  const embedUrl = getVideoEmbedUrl(props.url || '', props.provider || 'youtube')

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
        <p className='mt-1 text-muted-foreground text-xs'>YouTube, Vimeo, or direct video URL</p>
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

      {/* Video Preview */}
      {embedUrl && (
        <div>
          <Label>Preview</Label>
          <div className='relative bg-black mt-2 rounded-lg overflow-hidden'>
            <div
              style={{
                paddingBottom:
                  props.aspectRatio === '4/3'
                    ? '75%'
                    : props.aspectRatio === '1/1'
                    ? '100%'
                    : props.aspectRatio === '21/9'
                    ? '42.86%'
                    : '56.25%' // Default 16/9
              }}
              className='relative w-full'
            >
              {props.provider === 'direct' ? (
                <video src={embedUrl} controls className='absolute inset-0 w-full h-full'>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  className='absolute inset-0 w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title='Video preview'
                />
              )}
            </div>
          </div>
        </div>
      )}
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
