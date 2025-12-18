'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { componentRegistry } from '@/lib/page-builder/widgets'
import { cn } from '@/lib/utils'
import { GripVertical, Plus, Settings, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GridItem {
  id: string
  order: number
  components: any[]
  settings?: {
    className?: string
    verticalAlign?: 'top' | 'center' | 'bottom' | 'stretch'
    horizontalAlign?: 'left' | 'center' | 'right'
  }
}

interface GridItemsManagerProps {
  value: GridItem[]
  onChange: (items: GridItem[]) => void
  columns?: number
}

export function GridItemsManager({ value = [], onChange, columns = 3 }: GridItemsManagerProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  // Auto-generate grid items to match column count
  useEffect(() => {
    if (value.length === 0 && columns > 0) {
      const newItems: GridItem[] = Array.from({ length: columns }, (_, i) => ({
        id: `grid-item-${Date.now()}-${i}`,
        order: i,
        components: [],
        settings: {}
      }))
      onChange(newItems)
    }
  }, [columns, value.length, onChange])

  const handleAddItem = () => {
    const newItem: GridItem = {
      id: `grid-item-${Date.now()}`,
      order: value.length,
      components: [],
      settings: {}
    }
    onChange([...value, newItem])
  }

  const handleDeleteItem = (itemId: string) => {
    onChange(value.filter((item) => item.id !== itemId))
  }

  const handleAddComponentToItem = (itemId: string, componentType: string) => {
    const componentDef = componentRegistry.get(componentType as any)
    if (!componentDef) return

    const newComponent = {
      id: `comp-${Date.now()}`,
      type: componentType,
      order: 0,
      props: componentDef.defaultProps || {},
      settings: {}
    }

    const updatedItems = value.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          components: [...(item.components || []), newComponent]
        }
      }
      return item
    })

    onChange(updatedItems)
  }

  const handleDeleteComponentFromItem = (itemId: string, componentId: string) => {
    const updatedItems = value.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          components: item.components.filter((c) => c.id !== componentId)
        }
      }
      return item
    })

    onChange(updatedItems)
  }

  // Get basic component types
  const basicComponents = ['heading', 'text', 'button', 'image', 'icon-box', 'divider', 'spacer']

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <Label>Grid Items ({value.length} columns)</Label>
        <Button onClick={handleAddItem} size='sm' variant='outline'>
          <Plus className='mr-1 w-4 h-4' />
          Add More Column
        </Button>
      </div>

      <p className='text-muted-foreground text-xs'>
        Each grid item represents a column. Use the dropdown to add components to each column.
      </p>

      {value.length === 0 && (
        <Card>
          <CardContent className='py-8 text-muted-foreground text-sm text-center'>
            Generating {columns} grid items based on column count...
          </CardContent>
        </Card>
      )}

      <div className={cn('gap-3 grid', `grid-cols-${Math.min(columns, 4)}`)}>
        {value.map((item, index) => (
          <Card key={item.id} className='transition-all'>
            <CardContent className='p-3'>
              <div className='flex items-start gap-2'>
                <GripVertical className='mt-1 w-4 h-4 text-muted-foreground shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm'>Grid Item {index + 1}</span>
                      <span className='bg-muted px-2 py-0.5 rounded font-medium text-[10px] text-muted-foreground'>
                        {item.components?.length || 0} components
                      </span>
                    </div>
                    <div className='flex gap-1'>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedItemId(selectedItemId === item.id ? null : item.id)
                        }}
                      >
                        <Settings className='w-3 h-3' />
                      </Button>
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteItem(item.id)
                        }}
                      >
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>

                  {/* Show components in this item */}
                  {selectedItemId === item.id && (
                    <div className='space-y-2 bg-muted/30 mt-2 p-2 rounded'>
                      <div className='flex justify-between items-center'>
                        <Label className='text-xs'>Components in this item</Label>
                        <div className='relative'>
                          <select
                            className='px-2 py-1 border rounded text-xs'
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddComponentToItem(item.id, e.target.value)
                                e.target.value = ''
                              }
                            }}
                            defaultValue=''
                          >
                            <option value=''>+ Add Component</option>
                            {basicComponents.map((type) => {
                              const def = componentRegistry.get(type as any)
                              return (
                                <option key={type} value={type}>
                                  {def?.label || type}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      </div>

                      {item.components && item.components.length > 0 ? (
                        <div className='space-y-1'>
                          {item.components.map((comp, compIndex) => {
                            const compDef = componentRegistry.get(comp.type as any)
                            return (
                              <div
                                key={comp.id}
                                className='flex justify-between items-center bg-background px-2 py-1 rounded text-xs'
                              >
                                <span>
                                  {compIndex + 1}. {compDef?.label || comp.type}
                                </span>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='p-0 w-6 h-6'
                                  onClick={() => handleDeleteComponentFromItem(item.id, comp.id)}
                                >
                                  <Trash2 className='w-3 h-3' />
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className='py-2 text-muted-foreground text-xs text-center'>
                          No components yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {value.length > 0 && (
        <p className='text-muted-foreground text-xs'>
          Click on a grid item to add components. Components will render like column layouts.
        </p>
      )}
    </div>
  )
}
