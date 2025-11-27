/**
 * Spacing Control
 * Visual UI for configuring padding, margin, and gap with Tailwind classes
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
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SpacingConfig } from '@/lib/page-builder/tailwind-generator'
import { generateSpacingClasses } from '@/lib/page-builder/tailwind-generator'
import { Box, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

const SPACING_VALUES = [
    { label: 'None', value: '0' },
    { label: '1 (0.25rem)', value: '1' },
    { label: '2 (0.5rem)', value: '2' },
    { label: '3 (0.75rem)', value: '3' },
    { label: '4 (1rem)', value: '4' },
    { label: '5 (1.25rem)', value: '5' },
    { label: '6 (1.5rem)', value: '6' },
    { label: '8 (2rem)', value: '8' },
    { label: '10 (2.5rem)', value: '10' },
    { label: '12 (3rem)', value: '12' },
    { label: '16 (4rem)', value: '16' },
    { label: '20 (5rem)', value: '20' },
    { label: '24 (6rem)', value: '24' },
    { label: '32 (8rem)', value: '32' }
]

interface SpacingControlProps {
    value?: SpacingConfig
    onChange: (config: SpacingConfig, className: string) => void
}

export function SpacingControl({ value = {}, onChange }: SpacingControlProps) {
    const [config, setConfig] = useState<SpacingConfig>(value)
    const [mode, setMode] = useState<'simple' | 'advanced'>('simple')

    const handleChange = (newConfig: SpacingConfig) => {
        setConfig(newConfig)
        const className = generateSpacingClasses(newConfig)
        onChange(newConfig, className)
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Label className='flex items-center gap-2'>
                    <Box className='w-4 h-4' />
                    Spacing
                </Label>
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setMode(mode === 'simple' ? 'advanced' : 'simple')}
                >
                    {mode === 'simple' ? <Maximize2 className='w-4 h-4' /> : <Minimize2 className='w-4 h-4' />}
                </Button>
            </div>

            <Tabs defaultValue='padding' className='w-full'>
                <TabsList className='grid grid-cols-3 w-full'>
                    <TabsTrigger value='padding'>Padding</TabsTrigger>
                    <TabsTrigger value='margin'>Margin</TabsTrigger>
                    <TabsTrigger value='gap'>Gap</TabsTrigger>
                </TabsList>

                {/* PADDING */}
                <TabsContent value='padding' className='space-y-3'>
                    {mode === 'simple' ? (
                        // Simple mode: all sides at once
                        <div className='space-y-2'>
                            <Label className='text-xs'>All Sides</Label>
                            <Select
                                value={config.padding?.all || '0'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        padding: { ...config.padding, all: val, x: undefined, y: undefined, top: undefined, right: undefined, bottom: undefined, left: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select padding' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPACING_VALUES.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        // Advanced mode: individual sides
                        <div className='space-y-3'>
                            {/* Horizontal & Vertical */}
                            <div className='gap-2 grid grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label className='text-xs'>Horizontal (X)</Label>
                                    <Select
                                        value={config.padding?.x || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, x: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='X' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Vertical (Y)</Label>
                                    <Select
                                        value={config.padding?.y || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, y: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Y' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            {/* Individual sides */}
                            <div className='gap-2 grid grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label className='text-xs'>Top</Label>
                                    <Select
                                        value={config.padding?.top || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, top: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Top' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.padding?.bottom || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, bottom: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Bottom' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.padding?.left || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, left: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Left' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.padding?.right || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                padding: { ...config.padding, right: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Right' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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

                {/* MARGIN */}
                <TabsContent value='margin' className='space-y-3'>
                    {mode === 'simple' ? (
                        <div className='space-y-2'>
                            <Label className='text-xs'>All Sides</Label>
                            <Select
                                value={config.margin?.all || '0'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        margin: { ...config.margin, all: val, x: undefined, y: undefined, top: undefined, right: undefined, bottom: undefined, left: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select margin' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPACING_VALUES.map((item) => (
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
                                    <Label className='text-xs'>Horizontal (X)</Label>
                                    <Select
                                        value={config.margin?.x || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, x: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='X' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-xs'>Vertical (Y)</Label>
                                    <Select
                                        value={config.margin?.y || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, y: val, all: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Y' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div className='gap-2 grid grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label className='text-xs'>Top</Label>
                                    <Select
                                        value={config.margin?.top || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, top: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Top' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.margin?.bottom || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, bottom: val, all: undefined, y: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Bottom' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.margin?.left || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, left: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Left' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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
                                        value={config.margin?.right || ''}
                                        onValueChange={(val) =>
                                            handleChange({
                                                ...config,
                                                margin: { ...config.margin, right: val, all: undefined, x: undefined }
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Right' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPACING_VALUES.map((item) => (
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

                {/* GAP */}
                <TabsContent value='gap' className='space-y-3'>
                    <div className='gap-2 grid grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='text-xs'>All Gap</Label>
                            <Select
                                value={config.gap?.all || '0'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        gap: { ...config.gap, all: val, x: undefined, y: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Gap' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPACING_VALUES.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className='text-xs'>Horizontal (X)</Label>
                            <Select
                                value={config.gap?.x || ''}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        gap: { ...config.gap, x: val, all: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='X Gap' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPACING_VALUES.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className='text-xs'>Vertical (Y)</Label>
                            <Select
                                value={config.gap?.y || ''}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        gap: { ...config.gap, y: val, all: undefined }
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Y Gap' />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPACING_VALUES.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview */}
            <div className='bg-muted p-2 rounded font-mono text-muted-foreground text-xs'>
                {generateSpacingClasses(config) || 'No spacing applied'}
            </div>
        </div>
    )
}
