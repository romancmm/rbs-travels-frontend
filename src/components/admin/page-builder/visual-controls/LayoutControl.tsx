/**
 * Layout Control
 * Visual UI for configuring flex and grid layouts with Tailwind classes
 */

'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FlexConfig, GridConfig } from '@/lib/page-builder/tailwind-generator'
import { generateFlexClasses, generateGridClasses } from '@/lib/page-builder/tailwind-generator'
import { LayoutGrid, X } from 'lucide-react'
import { useState } from 'react'

const GAP_VALUES = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20']

interface LayoutControlProps {
    type?: 'flex' | 'grid' | 'block'
    flexValue?: FlexConfig
    gridValue?: GridConfig
    onChange: (type: 'flex' | 'grid' | 'block', config: FlexConfig | GridConfig | null, className: string) => void
}

export function LayoutControl({ type = 'block', flexValue = {}, gridValue = {}, onChange }: LayoutControlProps) {
    const [layoutType, setLayoutType] = useState<'flex' | 'grid' | 'block'>(type)
    const [flexConfig, setFlexConfig] = useState<FlexConfig>(flexValue)
    const [gridConfig, setGridConfig] = useState<GridConfig>(gridValue)

    const handleFlexChange = (newConfig: FlexConfig) => {
        setFlexConfig(newConfig)
        const className = generateFlexClasses(newConfig)
        onChange('flex', newConfig, className)
    }

    const handleGridChange = (newConfig: GridConfig) => {
        setGridConfig(newConfig)
        const className = generateGridClasses(newConfig)
        onChange('grid', newConfig, className)
    }

    const handleTypeChange = (newType: 'flex' | 'grid' | 'block') => {
        setLayoutType(newType)
        if (newType === 'flex') {
            onChange('flex', flexConfig, generateFlexClasses(flexConfig))
        } else if (newType === 'grid') {
            onChange('grid', gridConfig, generateGridClasses(gridConfig))
        } else {
            onChange('block', null, '')
        }
    }

    const handleClear = () => {
        setLayoutType('block')
        setFlexConfig({})
        setGridConfig({})
        onChange('block', null, '')
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Label className='flex items-center gap-2 font-semibold text-sm'>
                    <LayoutGrid className='w-4 h-4 text-primary' />
                    Layout
                </Label>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleClear}
                    className='h-8 text-muted-foreground hover:text-destructive'
                >
                    <X className='w-4 h-4' />
                    <span className='ml-1 text-xs'>Clear</span>
                </Button>
            </div>

            <Tabs value={layoutType} onValueChange={(val) => handleTypeChange(val as 'flex' | 'grid' | 'block')}>
                <TabsList className='grid grid-cols-3 w-full'>
                    <TabsTrigger value='block'>Block</TabsTrigger>
                    <TabsTrigger value='flex'>Flex</TabsTrigger>
                    <TabsTrigger value='grid'>Grid</TabsTrigger>
                </TabsList>

                {/* BLOCK */}
                <TabsContent value='block' className='space-y-3'>
                    <p className='text-muted-foreground text-sm'>Default block layout (no flex or grid)</p>
                </TabsContent>

                {/* FLEX */}
                <TabsContent value='flex' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Direction</Label>
                        <Select
                            value={flexConfig.direction || 'row'}
                            onValueChange={(val) =>
                                handleFlexChange({ ...flexConfig, direction: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='row'>Row →</SelectItem>
                                <SelectItem value='row-reverse'>Row Reverse ←</SelectItem>
                                <SelectItem value='col'>Column ↓</SelectItem>
                                <SelectItem value='col-reverse'>Column Reverse ↑</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Justify Content</Label>
                        <Select
                            value={flexConfig.justify || 'start'}
                            onValueChange={(val) =>
                                handleFlexChange({ ...flexConfig, justify: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='start'>Start</SelectItem>
                                <SelectItem value='end'>End</SelectItem>
                                <SelectItem value='center'>Center</SelectItem>
                                <SelectItem value='between'>Space Between</SelectItem>
                                <SelectItem value='around'>Space Around</SelectItem>
                                <SelectItem value='evenly'>Space Evenly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Align Items</Label>
                        <Select
                            value={flexConfig.align || 'start'}
                            onValueChange={(val) =>
                                handleFlexChange({ ...flexConfig, align: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='start'>Start</SelectItem>
                                <SelectItem value='end'>End</SelectItem>
                                <SelectItem value='center'>Center</SelectItem>
                                <SelectItem value='baseline'>Baseline</SelectItem>
                                <SelectItem value='stretch'>Stretch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Wrap</Label>
                        <Select
                            value={flexConfig.wrap || 'nowrap'}
                            onValueChange={(val) =>
                                handleFlexChange({ ...flexConfig, wrap: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='nowrap'>No Wrap</SelectItem>
                                <SelectItem value='wrap'>Wrap</SelectItem>
                                <SelectItem value='wrap-reverse'>Wrap Reverse</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Gap</Label>
                        <Select
                            value={flexConfig.gap || '0'}
                            onValueChange={(val) =>
                                handleFlexChange({ ...flexConfig, gap: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GAP_VALUES.map((val) => (
                                    <SelectItem key={val} value={val}>
                                        {val} ({val === '0' ? 'None' : `${parseFloat(val) * 0.25}rem`})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* GRID */}
                <TabsContent value='grid' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Grid Columns</Label>
                        <Select
                            value={gridConfig.cols?.toString() || '1'}
                            onValueChange={(val) =>
                                handleGridChange({ ...gridConfig, cols: parseInt(val) })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                        {num} Column{num > 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Grid Rows</Label>
                        <Select
                            value={gridConfig.rows?.toString() || 'auto'}
                            onValueChange={(val) =>
                                handleGridChange({ ...gridConfig, rows: val === 'auto' ? undefined : parseInt(val) })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='auto'>Auto</SelectItem>
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                        {num} Row{num > 1 ? 's' : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Gap</Label>
                        <Select
                            value={gridConfig.gap || '0'}
                            onValueChange={(val) =>
                                handleGridChange({ ...gridConfig, gap: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GAP_VALUES.map((val) => (
                                    <SelectItem key={val} value={val}>
                                        {val} ({val === '0' ? 'None' : `${parseFloat(val) * 0.25}rem`})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Justify Items</Label>
                        <Select
                            value={gridConfig.justifyItems || 'stretch'}
                            onValueChange={(val) =>
                                handleGridChange({ ...gridConfig, justifyItems: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='start'>Start</SelectItem>
                                <SelectItem value='end'>End</SelectItem>
                                <SelectItem value='center'>Center</SelectItem>
                                <SelectItem value='stretch'>Stretch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Align Items</Label>
                        <Select
                            value={gridConfig.alignItems || 'stretch'}
                            onValueChange={(val) =>
                                handleGridChange({ ...gridConfig, alignItems: val as any })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='start'>Start</SelectItem>
                                <SelectItem value='end'>End</SelectItem>
                                <SelectItem value='center'>Center</SelectItem>
                                <SelectItem value='baseline'>Baseline</SelectItem>
                                <SelectItem value='stretch'>Stretch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview */}
            <div className='bg-muted p-2 rounded font-mono text-muted-foreground text-xs'>
                {layoutType === 'flex' && (generateFlexClasses(flexConfig) || 'flex')}
                {layoutType === 'grid' && (generateGridClasses(gridConfig) || 'grid')}
                {layoutType === 'block' && 'block (default)'}
            </div>
        </div>
    )
}
