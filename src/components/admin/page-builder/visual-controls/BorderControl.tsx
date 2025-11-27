/**
 * Border Control
 * Visual UI for configuring borders and radius with Tailwind classes
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
import type { BorderConfig } from '@/lib/page-builder/tailwind-generator'
import { generateBorderClasses } from '@/lib/page-builder/tailwind-generator'
import { Square, X } from 'lucide-react'
import { useState } from 'react'

const BORDER_WIDTHS = [
    { label: 'None', value: 'none' },
    // { label: 'Thin', value: '' },
    { label: '2px', value: '2' },
    { label: '4px', value: '4' },
    { label: '8px', value: '8' }
]

const BORDER_STYLES = [
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
    { label: 'None', value: 'none' }
]

const BORDER_COLORS = [
    { label: 'Gray 200', value: 'border-gray-200' },
    { label: 'Gray 300', value: 'border-gray-300' },
    { label: 'Gray 400', value: 'border-gray-400' },
    { label: 'Black', value: 'border-black' },
    { label: 'White', value: 'border-white' },
    { label: 'Primary', value: 'border-primary' },
    { label: 'Secondary', value: 'border-secondary' },
    { label: 'Blue 500', value: 'border-blue-500' },
    { label: 'Red 500', value: 'border-red-500' }
]

const RADIUS_VALUES = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'XL', value: 'xl' },
    { label: '2XL', value: '2xl' },
    { label: '3XL', value: '3xl' },
    { label: 'Full', value: 'full' }
]

interface BorderControlProps {
    value?: BorderConfig
    onChange: (config: BorderConfig, className: string) => void
}

export function BorderControl({ value = {}, onChange }: BorderControlProps) {
    const [config, setConfig] = useState<BorderConfig>(value)
    const [mode, setMode] = useState<'simple' | 'advanced'>('simple')

    const handleChange = (newConfig: BorderConfig) => {
        setConfig(newConfig)
        const className = generateBorderClasses(newConfig)
        onChange(newConfig, className)
    }

    const handleClear = () => {
        const emptyConfig: BorderConfig = {}
        setConfig(emptyConfig)
        onChange(emptyConfig, '')
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Label className='flex items-center gap-2'>
                    <Square className='w-4 h-4' />
                    Border & Radius
                </Label>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
                    >
                        {mode === 'simple' ? 'Advanced' : 'Simple'}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={handleClear}>
                        <X className='w-4 h-4' />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue='width' className='w-full'>
                <TabsList className='grid grid-cols-4 w-full'>
                    <TabsTrigger value='width'>Width</TabsTrigger>
                    <TabsTrigger value='style'>Style</TabsTrigger>
                    <TabsTrigger value='color'>Color</TabsTrigger>
                    <TabsTrigger value='radius'>Radius</TabsTrigger>
                </TabsList>

                {/* WIDTH */}
                <TabsContent value='width' className='space-y-3'>
                    {mode === 'simple' ? (
                        <div className='space-y-2'>
                            <Label className='text-xs'>All Sides</Label>
                            <Select
                                value={config.width?.all || '0'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        width: { all: val, x: undefined, y: undefined, top: undefined, right: undefined, bottom: undefined, left: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select width' />
                                </SelectTrigger>
                                <SelectContent>
                                    {BORDER_WIDTHS.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            <div className='gap-2 grid grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label className='text-xs'>Top</Label>
                                    <Select
                                        value={config.width?.top || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                width: { ...config.width, top: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Top' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BORDER_WIDTHS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Bottom</Label>
                                    <Select
                                        value={config.width?.bottom || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                width: { ...config.width, bottom: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Bottom' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BORDER_WIDTHS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Left</Label>
                                    <Select
                                        value={config.width?.left || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                width: { ...config.width, left: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Left' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BORDER_WIDTHS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Right</Label>
                                    <Select
                                        value={config.width?.right || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                width: { ...config.width, right: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Right' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BORDER_WIDTHS.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* STYLE */}
                <TabsContent value='style' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Border Style</Label>
                        <Select
                            value={config.style || 'solid'}
                            onValueChange={(val) => handleChange({ ...config, style: val as any })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select style' />
                            </SelectTrigger>
                            <SelectContent>
                                {BORDER_STYLES.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* COLOR */}
                <TabsContent value='color' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Border Color</Label>
                        <Select
                            value={config.color || ''}
                            onValueChange={(val) => handleChange({ ...config, color: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select color' />
                            </SelectTrigger>
                            <SelectContent>
                                {BORDER_COLORS.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* RADIUS */}
                <TabsContent value='radius' className='space-y-3'>
                    {mode === 'simple' ? (
                        <div className='space-y-2'>
                            <Label className='text-xs'>All Corners</Label>
                            <Select
                                value={config.radius?.all || 'none'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        radius: { all: val, top: undefined, bottom: undefined, left: undefined, right: undefined, tl: undefined, tr: undefined, bl: undefined, br: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select radius' />
                                </SelectTrigger>
                                <SelectContent>
                                    {RADIUS_VALUES.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            <div className='gap-2 grid grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label className='text-xs'>Top Left</Label>
                                    <Select
                                        value={config.radius?.tl || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                radius: { ...config.radius, tl: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='TL' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RADIUS_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Top Right</Label>
                                    <Select
                                        value={config.radius?.tr || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                radius: { ...config.radius, tr: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='TR' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RADIUS_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Bottom Left</Label>
                                    <Select
                                        value={config.radius?.bl || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                radius: { ...config.radius, bl: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='BL' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RADIUS_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Bottom Right</Label>
                                    <Select
                                        value={config.radius?.br || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                radius: { ...config.radius, br: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='BR' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RADIUS_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Preview */}
            <div className='bg-muted p-2 rounded font-mono text-muted-foreground text-xs'>
                {generateBorderClasses(config) || 'No border applied'}
            </div>
        </div>
    )
}
