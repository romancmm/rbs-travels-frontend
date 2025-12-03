/**
 * Simplified Properties Panel - ClassName Only
 * Uses visual configuration tools that generate Tailwind classes
 */

'use client'

import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { findElementById } from '@/lib/page-builder/builder-utils'
import type { FlexConfig, GridConfig, VisualConfig } from '@/lib/page-builder/tailwind-generator'
import {
  parseClassNameToConfig,
  updateClassNameAspect
} from '@/lib/page-builder/tailwind-generator'
import { componentRegistry } from '@/lib/page-builder/widgets'
import type { BaseComponent, PropertyField, PropertyPanel } from '@/types/page-builder'
import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GridItemsManager } from './GridItemsManager'
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
  const savePage = useBuilderStore((state) => state.savePage)

  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedElement = selectedId ? findElementById(content, selectedId) : null

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      selectElement(null, null)
      setHasChanges(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await savePage()
      setHasChanges(false)
    } catch (error) {
      console.error('Failed to save changes:', error)
    } finally {
      setIsSaving(false)
      handleOpenChange(false)
    }
  }

  const markAsChanged = () => {
    setHasChanges(true)
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
        return `${
          componentRegistry.get(selectedElement.element.type)?.label || 'Component'
        } Properties`
      default:
        return 'Properties'
    }
  }

  return (
    <Sheet open={rightPanelOpen && !!selectedId} onOpenChange={handleOpenChange}>
      <SheetContent side='right' className='flex flex-col p-0 w-[400px] sm:w-[500px]'>
        <SheetHeader className='space-y-2'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2'>
              <Settings className='w-5 h-5 text-primary' />
              <SheetTitle>{getTitle()}</SheetTitle>
            </div>
          </div>
          <SheetDescription>
            Use visual tools to configure styling with Tailwind CSS classes
          </SheetDescription>
        </SheetHeader>

        {/* <Separator /> */}

        <div className='flex-1 px-6 overflow-y-auto'>
          {selectedElement && (
            <div className='py-6'>
              {selectedElement.type === 'section' && (
                <SectionProperties
                  section={selectedElement.element}
                  onUpdate={(updates) => {
                    updateSection(selectedId!, updates)
                    markAsChanged()
                  }}
                />
              )}
              {selectedElement.type === 'row' && (
                <RowProperties
                  row={selectedElement.element}
                  onUpdate={(updates) => {
                    updateRow(selectedId!, updates)
                    markAsChanged()
                  }}
                />
              )}
              {selectedElement.type === 'column' && (
                <ColumnProperties
                  column={selectedElement.element}
                  onUpdate={(updates) => {
                    updateColumn(selectedId!, updates)
                    markAsChanged()
                  }}
                />
              )}
              {selectedElement.type === 'component' && (
                <ComponentProperties
                  component={selectedElement.element}
                  onUpdate={(updates) => {
                    updateComponent(selectedId!, updates)
                    markAsChanged()
                  }}
                />
              )}
            </div>
          )}
        </div>

        <SheetFooter>
          <Button
            variant={hasChanges ? 'default' : 'outline'}
            size='sm'
            className='h-8 text-xs'
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ==================== SECTION PROPERTIES ====================

function SectionProperties({
  section,
  onUpdate
}: {
  section: any
  onUpdate: (updates: any) => void
}) {
  const [currentClassName, setCurrentClassName] = useState(section.settings?.className || '')
  const parsedConfig = parseClassNameToConfig(currentClassName)

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
            value={parsedConfig.spacing || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type={parsedConfig.layout?.type || 'block'}
            flexValue={parsedConfig.layout?.flex}
            gridValue={parsedConfig.layout?.grid}
            onChange={(type, config, _className) => {
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
            value={parsedConfig.background || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={parsedConfig.border || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value={parsedConfig.shadow || 'none'}
            onChange={(preset, _className) => {
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
  const parsedConfig = parseClassNameToConfig(currentClassName)

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
            value={parsedConfig.spacing || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type={parsedConfig.layout?.type || 'flex'}
            flexValue={parsedConfig.layout?.flex || { direction: 'row', gap: '4' }}
            gridValue={parsedConfig.layout?.grid}
            onChange={(type, config, _className) => {
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
            value={parsedConfig.background || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={parsedConfig.border || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value={parsedConfig.shadow || 'none'}
            onChange={(preset, _className) => {
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
  const parsedConfig = parseClassNameToConfig(currentClassName)

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
            value={parsedConfig.spacing || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <LayoutControl
            type={parsedConfig.layout?.type || 'flex'}
            flexValue={parsedConfig.layout?.flex || { direction: 'col', gap: '2' }}
            gridValue={parsedConfig.layout?.grid}
            onChange={(type, config, _className) => {
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
            value={parsedConfig.background || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={parsedConfig.border || {}}
            onChange={(config, _className) => {
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

// ==================== DYNAMIC PROPERTY FIELDS ====================

interface DynamicPropertyFieldsProps {
  panels: PropertyPanel[]
  props: Record<string, any>
  onChange: (key: string, value: any) => void
}

function DynamicPropertyFields({ panels, props, onChange }: DynamicPropertyFieldsProps) {
  if (panels.length === 0) return null

  // Filter panels based on dataSource for grid component
  const filteredPanels = panels.filter((panel) => {
    // For grid component, conditionally show panels based on dataSource
    if (props.dataSource === 'api' && panel.id === 'manual-items') {
      return false // Hide manual items panel in API mode
    }
    if (props.dataSource === 'manual' && panel.id === 'api-settings') {
      return false // Hide API settings panel in manual mode
    }
    return true
  })

  if (filteredPanels.length === 0) return null

  // If only one panel, render fields directly
  if (filteredPanels.length === 1) {
    return (
      <div className='space-y-4'>
        {filteredPanels[0].fields.map((field) => (
          <PropertyFieldRenderer
            key={field.name}
            field={field}
            value={props[field.name]}
            onChange={(value) => onChange(field.name, value)}
            allProps={props}
          />
        ))}
      </div>
    )
  }

  // Multiple panels - use accordion or sections
  return (
    <div className='space-y-6'>
      {filteredPanels.map((panel) => (
        <div key={panel.id} className='space-y-4'>
          <div className='pb-2 border-b'>
            <h4 className='font-medium text-sm'>{panel.label}</h4>
          </div>
          {panel.fields.map((field) => (
            <PropertyFieldRenderer
              key={field.name}
              field={field}
              value={props[field.name]}
              onChange={(value) => onChange(field.name, value)}
              allProps={props}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ==================== PROPERTY FIELD RENDERER ====================

interface PropertyFieldRendererProps {
  field: PropertyField
  value: any
  onChange: (value: any) => void
  allProps?: Record<string, any>
}

function PropertyFieldRenderer({
  field,
  value,
  onChange,
  allProps = {}
}: PropertyFieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        )

      case 'textarea':
      case 'rich-text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        )

      case 'number':
      case 'slider':
        return (
          <Input
            type='number'
            value={value ?? field.defaultValue ?? ''}
            onChange={(e) => onChange(Number(e.target.value))}
            min={field.min}
            max={field.max}
            step={field.step}
            placeholder={field.placeholder}
          />
        )

      case 'toggle':
        return (
          <div className='flex items-center gap-2'>
            <Switch checked={value ?? field.defaultValue ?? false} onCheckedChange={onChange} />
            <span className='text-muted-foreground text-sm'>{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        )

      case 'select':
        return (
          <Select
            value={value?.toString() || field.defaultValue?.toString()}
            onValueChange={onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'color':
        return (
          <div className='flex gap-2'>
            <Input
              type='color'
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className='w-20 h-10'
            />
            <Input
              type='text'
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder='#000000'
              className='flex-1 font-mono'
            />
          </div>
        )

      case 'image-upload':
        return (
          <FileUploader
            value={value || ''}
            onChangeAction={(val: string | string[]) => onChange(val)}
            size='medium'
          />
        )

      case 'multi-select':
        return (
          <div className='space-y-2'>
            {field.options?.map((option) => (
              <div key={option.value} className='flex items-center gap-2'>
                <Switch
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (checked) {
                      onChange([...currentValues, option.value])
                    } else {
                      onChange(currentValues.filter((v: any) => v !== option.value))
                    }
                  }}
                />
                <Label>{option.label}</Label>
              </div>
            ))}
          </div>
        )

      case 'alignment':
        return (
          <div className='flex gap-2'>
            {['left', 'center', 'right', 'justify'].map((align) => (
              <Button
                key={align}
                variant={value === align ? 'default' : 'outline'}
                size='sm'
                onClick={() => onChange(align)}
                className='flex-1'
              >
                {align}
              </Button>
            ))}
          </div>
        )

      case 'grid-items':
        return (
          <GridItemsManager
            value={value || []}
            onChange={onChange}
            columns={allProps.columns || 3}
          />
        )

      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        )
    }
  }

  return (
    <div className='space-y-2'>
      <Label>
        {field.label}
        {field.required && <span className='ml-1 text-destructive'>*</span>}
      </Label>
      {renderField()}
      {field.description && <p className='text-muted-foreground text-xs'>{field.description}</p>}
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
  const parsedConfig = parseClassNameToConfig(currentClassName)
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
          {/* Dynamic property fields from component definition */}
          {componentDef?.propertyPanels && (
            <DynamicPropertyFields
              panels={componentDef.propertyPanels}
              props={localProps}
              onChange={handlePropChange}
            />
          )}

          {/* Fallback for components without propertyPanels */}
          {!componentDef?.propertyPanels && (
            <>
              {component.type === 'heading' && (
                <HeadingProperties props={localProps} onChange={handlePropChange} />
              )}
              {component.type === 'text' && (
                <TextProperties props={localProps} onChange={handlePropChange} />
              )}
              {component.type === 'button' && (
                <ButtonProperties props={localProps} onChange={handlePropChange} />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value='style' className='space-y-6 mt-6'>
          <SpacingControl
            value={parsedConfig.spacing || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { spacing: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BackgroundControl
            value={parsedConfig.background || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { background: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <BorderControl
            value={parsedConfig.border || {}}
            onChange={(config, _className) => {
              const merged = updateClassNameAspect(currentClassName, { border: config })
              handleVisualChange(merged)
            }}
          />

          <Separator />

          <ShadowControl
            value={parsedConfig.shadow || 'none'}
            onChange={(preset, _className) => {
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
