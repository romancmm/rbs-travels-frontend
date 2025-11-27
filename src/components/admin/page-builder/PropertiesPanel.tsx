/**
 * Simplified Properties Panel - ClassName Only
 * Uses visual configuration tools that generate Tailwind classes
 */

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { findElementById } from '@/lib/page-builder/builder-utils'
import { componentRegistry } from '@/lib/page-builder/component-registry'
import type { FlexConfig, GridConfig, VisualConfig } from '@/lib/page-builder/tailwind-generator'
import { updateClassNameAspect } from '@/lib/page-builder/tailwind-generator'
import type { BaseComponent } from '@/types/page-builder'
import { Settings, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  BackgroundControl,
  BorderControl,
  LayoutControl,
  ShadowControl,
  SpacingControl
} from './visual-controls'

export function PropertiesPanel() {
  const selectedId = useBuilderStore((state) => state.selection.selectedId)
  const selectedType = useBuilderStore((state) => state.selection.selectedType)
  const rightPanelOpen = useBuilderStore((state) => state.ui.rightPanelOpen)
  const selectElement = useBuilderStore((state) => state.selectElement)
  const content = useBuilderStore((state) => state.content)
  const updateComponent = useBuilderStore((state) => state.updateComponent)
  const updateSection = useBuilderStore((state) => state.updateSection)
  const updateRow = useBuilderStore((state) => state.updateRow)
  const updateColumn = useBuilderStore((state) => state.updateColumn)

  const selectedElement = selectedId ? findElementById(content, selectedId) : null

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      selectElement(null, null)
    }
  }

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
        return `${componentRegistry.get(selectedElement.element.type)?.label || 'Component'} Properties`
      default:
        return 'Properties'
    }
  }

  return (
    <Sheet open={rightPanelOpen && !!selectedId} onOpenChange={handleOpenChange}>
      <SheetContent side='right' className='flex flex-col p-0 w-[400px] sm:w-[500px]'>
        <SheetHeader className='space-y-2 px-6 pt-6'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2'>
              <Settings className='w-5 h-5 text-primary' />
              <SheetTitle>{getTitle()}</SheetTitle>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='w-6 h-6'
              onClick={() => selectElement(null, null)}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
          <SheetDescription>
            Use visual tools to configure styling with Tailwind CSS classes
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <div className='flex-1 px-6 overflow-y-auto'>
          {selectedElement && (
            <div className='py-6'>
              {selectedElement.type === 'section' && (
                <SectionProperties
                  section={selectedElement.element}
                  onUpdate={(updates) => updateSection(selectedId!, updates)}
                />
              )}
              {selectedElement.type === 'row' && (
                <RowProperties
                  row={selectedElement.element}
                  onUpdate={(updates) => updateRow(selectedId!, updates)}
                />
              )}
              {selectedElement.type === 'column' && (
                <ColumnProperties
                  column={selectedElement.element}
                  onUpdate={(updates) => updateColumn(selectedId!, updates)}
                />
              )}
              {selectedElement.type === 'component' && (
                <ComponentProperties
                  component={selectedElement.element}
                  onUpdate={(updates) => updateComponent(selectedId!, updates)}
                />
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ==================== SECTION PROPERTIES ====================

function SectionProperties({ section, onUpdate }: { section: any; onUpdate: (updates: any) => void }) {
  const [currentClassName, setCurrentClassName] = useState(section.settings?.className || '')

  useEffect(() => {
    setCurrentClassName(section.settings?.className || '')
  }, [section])

  const handleVisualChange = (newClasses: string) => {
    setCurrentClassName(newClasses)
    onUpdate({ settings: { ...section.settings, className: newClasses } })
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='layout' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='layout'>Layout</TabsTrigger>
          <TabsTrigger value='style'>Style</TabsTrigger>
          <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value='layout' className='space-y-6 mt-6'>
          <SpacingControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type='block'
            onChange={(type, config, className) => {
              const layoutConfig: Partial<VisualConfig> = {
                layout: {
                  type,
                  ...(type === 'flex' && { flex: config as FlexConfig }),
                  ...(type === 'grid' && { grid: config as GridConfig })
                }
              }
              const merged = updateClassNameAspect(currentClassName, layoutConfig)
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='style' className='space-y-6 mt-6'>
          <BackgroundControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value='none'
            onChange={(preset, className) => {
              const merged = updateClassNameAspect(currentClassName, { shadow: preset })
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label>Final className</Label>
            <Input
              value={currentClassName}
              onChange={(e) => handleVisualChange(e.target.value)}
              placeholder='Enter custom Tailwind classes'
              className='font-mono text-sm'
            />
            <p className='text-muted-foreground text-xs'>
              All styling is saved as Tailwind CSS classes
            </p>
          </div>

          <div className='bg-muted p-3 rounded-lg'>
            <p className='mb-2 font-medium text-sm'>Preview</p>
            <div className='bg-white p-2 rounded font-mono text-xs break-all'>
              {currentClassName || 'No classes applied'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== ROW PROPERTIES ====================

function RowProperties({ row, onUpdate }: { row: any; onUpdate: (updates: any) => void }) {
  const [currentClassName, setCurrentClassName] = useState(row.settings?.className || '')

  useEffect(() => {
    setCurrentClassName(row.settings?.className || '')
  }, [row])

  const handleVisualChange = (newClasses: string) => {
    setCurrentClassName(newClasses)
    onUpdate({ settings: { ...row.settings, className: newClasses } })
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='layout' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='layout'>Layout</TabsTrigger>
          <TabsTrigger value='style'>Style</TabsTrigger>
          <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value='layout' className='space-y-6 mt-6'>
          <SpacingControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type='flex'
            flexValue={{ direction: 'row', gap: '4' }}
            onChange={(type, config, className) => {
              const layoutConfig: Partial<VisualConfig> = {
                layout: {
                  type,
                  ...(type === 'flex' && { flex: config as FlexConfig }),
                  ...(type === 'grid' && { grid: config as GridConfig })
                }
              }
              const merged = updateClassNameAspect(currentClassName, layoutConfig)
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='style' className='space-y-6 mt-6'>
          <BackgroundControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value='none'
            onChange={(preset, className) => {
              const merged = updateClassNameAspect(currentClassName, { shadow: preset })
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label>Final className</Label>
            <Input
              value={currentClassName}
              onChange={(e) => handleVisualChange(e.target.value)}
              placeholder='Enter custom Tailwind classes'
              className='font-mono text-sm'
            />
            <p className='text-muted-foreground text-xs'>
              All styling is saved as Tailwind CSS classes
            </p>
          </div>

          <div className='bg-muted p-3 rounded-lg'>
            <p className='mb-2 font-medium text-sm'>Preview</p>
            <div className='bg-white p-2 rounded font-mono text-xs break-all'>
              {currentClassName || 'No classes applied'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== COLUMN PROPERTIES ====================

function ColumnProperties({ column, onUpdate }: { column: any; onUpdate: (updates: any) => void }) {
  const [currentClassName, setCurrentClassName] = useState(column.settings?.className || '')

  useEffect(() => {
    setCurrentClassName(column.settings?.className || '')
  }, [column])

  const handleVisualChange = (newClasses: string) => {
    setCurrentClassName(newClasses)
    onUpdate({ settings: { ...column.settings, className: newClasses } })
  }

  return (
    <div className='space-y-6'>
      <Tabs defaultValue='layout' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='layout'>Layout</TabsTrigger>
          <TabsTrigger value='style'>Style</TabsTrigger>
          <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value='layout' className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label>Column Width (1-12)</Label>
            <Input
              type='number'
              min={1}
              max={12}
              value={column.width}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 1 })}
            />
            <p className='text-muted-foreground text-xs'>
              Bootstrap-style grid: {column.width}/12 ({((column.width / 12) * 100).toFixed(1)}%)
            </p>
          </div>

          <Separator />

          <SpacingControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type='flex'
            flexValue={{ direction: 'col', gap: '2' }}
            onChange={(type, config, className) => {
              const layoutConfig: Partial<VisualConfig> = {
                layout: {
                  type,
                  ...(type === 'flex' && { flex: config as FlexConfig }),
                  ...(type === 'grid' && { grid: config as GridConfig })
                }
              }
              const merged = updateClassNameAspect(currentClassName, layoutConfig)
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='style' className='space-y-6 mt-6'>
          <BackgroundControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value='none'
            onChange={(preset, className) => {
              const merged = updateClassNameAspect(currentClassName, { shadow: preset })
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label>Final className</Label>
            <Input
              value={currentClassName}
              onChange={(e) => handleVisualChange(e.target.value)}
              placeholder='Enter custom Tailwind classes'
              className='font-mono text-sm'
            />
            <p className='text-muted-foreground text-xs'>
              All styling is saved as Tailwind CSS classes
            </p>
          </div>

          <div className='bg-muted p-3 rounded-lg'>
            <p className='mb-2 font-medium text-sm'>Preview</p>
            <div className='bg-white p-2 rounded font-mono text-xs break-all'>
              {currentClassName || 'No classes applied'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
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
  const [currentClassName, setCurrentClassName] = useState(component.settings?.className || '')
  const [localProps, setLocalProps] = useState(component.props)

  useEffect(() => {
    setCurrentClassName(component.settings?.className || '')
    setLocalProps(component.props)
  }, [component])

  const handleVisualChange = (newClasses: string) => {
    setCurrentClassName(newClasses)
    onUpdate({ settings: { ...component.settings, className: newClasses } })
  }

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

      <Tabs defaultValue='content' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='content'>Content</TabsTrigger>
          <TabsTrigger value='style'>Style</TabsTrigger>
          <TabsTrigger value='advanced'>Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value='content' className='space-y-6 mt-6'>
          {/* Component-specific props */}
          {component.type === 'heading' && (
            <HeadingProperties props={localProps} onChange={handlePropChange} />
          )}
          {component.type === 'text' && (
            <TextProperties props={localProps} onChange={handlePropChange} />
          )}
          {component.type === 'button' && (
            <ButtonProperties props={localProps} onChange={handlePropChange} />
          )}
          {/* Add more component types as needed */}
        </TabsContent>

        <TabsContent value='style' className='space-y-6 mt-6'>
          <SpacingControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BackgroundControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={{}}
            onChange={(config, className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value='none'
            onChange={(preset, className) => {
              const merged = updateClassNameAspect(currentClassName, { shadow: preset })
              handleVisualChange(merged)
            }}
          />
        </TabsContent>

        <TabsContent value='advanced' className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label>Final className</Label>
            <Input
              value={currentClassName}
              onChange={(e) => handleVisualChange(e.target.value)}
              placeholder='Enter custom Tailwind classes'
              className='font-mono text-sm'
            />
            <p className='text-muted-foreground text-xs'>
              All styling is saved as Tailwind CSS classes
            </p>
          </div>

          <div className='bg-muted p-3 rounded-lg'>
            <p className='mb-2 font-medium text-sm'>Preview</p>
            <div className='bg-white p-2 rounded font-mono text-xs break-all'>
              {currentClassName || 'No classes applied'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== COMPONENT-SPECIFIC PROPERTIES ====================

function HeadingProperties({ props, onChange }: any) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder='Enter heading text'
        />
      </div>
      {/* Add more heading-specific props */}
    </div>
  )
}

function TextProperties({ props, onChange }: any) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Text Content</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder='Enter text'
        />
      </div>
    </div>
  )
}

function ButtonProperties({ props, onChange }: any) {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Button Text</Label>
        <Input
          value={props.text || ''}
          onChange={(e) => onChange('text', e.target.value)}
          placeholder='Button text'
        />
      </div>
      <div className='space-y-2'>
        <Label>Link URL</Label>
        <Input
          value={props.url || ''}
          onChange={(e) => onChange('url', e.target.value)}
          placeholder='https://'
        />
      </div>
    </div>
  )
}
