/**
 * Background Control
 * Visual UI for configuring background with Tailwind classes
 */

'use client'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BackgroundConfig } from '@/lib/page-builder/tailwind-generator'
import { generateBackgroundClasses } from '@/lib/page-builder/tailwind-generator'
import { Paintbrush, X } from 'lucide-react'
import { useState } from 'react'

const COLOR_PRESETS = [
    { label: 'White', value: 'bg-white' },
    { label: 'Black', value: 'bg-black' },
    { label: 'Gray 50', value: 'bg-gray-50' },
    { label: 'Gray 100', value: 'bg-gray-100' },
    { label: 'Gray 200', value: 'bg-gray-200' },
    { label: 'Gray 300', value: 'bg-gray-300' },
    { label: 'Blue 50', value: 'bg-blue-50' },
    { label: 'Blue 500', value: 'bg-blue-500' },
    { label: 'Blue 600', value: 'bg-blue-600' },
    { label: 'Primary', value: 'bg-primary' },
    { label: 'Secondary', value: 'bg-secondary' },
    { label: 'Accent', value: 'bg-accent' },
    { label: 'Muted', value: 'bg-muted' }
]

const GRADIENT_DIRECTIONS = [
    { label: 'Right', value: 'to-r' },
    { label: 'Left', value: 'to-l' },
    { label: 'Top', value: 'to-t' },
    { label: 'Bottom', value: 'to-b' },
    { label: 'Top Right', value: 'to-tr' },
    { label: 'Top Left', value: 'to-tl' },
    { label: 'Bottom Right', value: 'to-br' },
    { label: 'Bottom Left', value: 'to-bl' }
]

const COLOR_OPTIONS = [
    'white', 'black', 'gray-50', 'gray-100', 'gray-200', 'gray-300', 'gray-400', 'gray-500',
    'red-500', 'orange-500', 'yellow-500', 'green-500', 'blue-500', 'indigo-500', 'purple-500', 'pink-500'
]

interface BackgroundControlProps {
    value?: BackgroundConfig
    onChange: (config: BackgroundConfig, className: string) => void
}

export function BackgroundControl({ value = {}, onChange }: BackgroundControlProps) {
    const [config, setConfig] = useState<BackgroundConfig>(value)

    const handleChange = (newConfig: BackgroundConfig) => {
        setConfig(newConfig)
        const className = generateBackgroundClasses(newConfig)
        onChange(newConfig, className)
    }

    const handleClear = () => {
        const emptyConfig: BackgroundConfig = { type: undefined }
        setConfig(emptyConfig)
        onChange(emptyConfig, '')
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Label className='flex items-center gap-2 font-semibold text-sm'>
                    <Paintbrush className='w-4 h-4 text-primary' />
                    Background
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

            <Tabs value={config.type || 'color'} onValueChange={(val) => handleChange({ ...config, type: val as any })}>
                <TabsList className='grid grid-cols-3 w-full h-10'>
                    <TabsTrigger value='color' className='text-xs'>
                        <div className='flex items-center gap-1.5'>
                            <div className='bg-linear-to-r from-blue-500 to-blue-600 rounded-full w-3 h-3' />
                            Color
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value='gradient' className='text-xs'>
                        <div className='flex items-center gap-1.5'>
                            <div className='bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full w-3 h-3' />
                            Gradient
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value='image' className='text-xs'>
                        <div className='flex items-center gap-1.5'>
                            <div className='bg-linear-to-br from-gray-400 to-gray-600 rounded w-3 h-3' />
                            Image
                        </div>
                    </TabsTrigger>
                </TabsList>

                {/* COLOR */}
                <TabsContent value='color' className='space-y-4 pt-4'>
                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>Preset Colors</Label>
                        <Select
                            value={config.color || 'none'}
                            onValueChange={(val) => handleChange({ ...config, type: 'color', color: val === 'none' ? undefined : val })}
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue placeholder='Choose a color preset' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>
                                    <div className='flex items-center gap-2'>
                                        <div className='border border-dashed rounded w-4 h-4' />
                                        <span className='text-muted-foreground'>None</span>
                                    </div>
                                </SelectItem>
                                {COLOR_PRESETS.map((preset) => (
                                    <SelectItem key={preset.value} value={preset.value}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded ${preset.value} border shadow-sm`} />
                                            <span>{preset.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <span className='border-muted border-t w-full' />
                        </div>
                        <div className='relative flex justify-center text-xs'>
                            <span className='bg-background px-2 text-muted-foreground'>OR</span>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>Custom Tailwind Class</Label>
                        <Input
                            placeholder='e.g., bg-[#ff0000] or bg-rose-500'
                            value={config.color || ''}
                            onChange={(e) => handleChange({ ...config, type: 'color', color: e.target.value })}
                            className='font-mono text-sm'
                        />
                        <p className='text-[10px] text-muted-foreground'>Use any Tailwind color class or arbitrary value</p>
                    </div>
                </TabsContent>

                {/* GRADIENT */}
                <TabsContent value='gradient' className='space-y-4 pt-4'>
                    <div className='space-y-2'>
                        <Label className='flex items-center gap-2 font-medium text-muted-foreground text-xs'>
                            Direction
                            <span className='font-normal text-[10px]'>(How the gradient flows)</span>
                        </Label>
                        <Select
                            value={config.gradient?.direction || 'to-r'}
                            onValueChange={(val) =>
                                handleChange({
                                    ...config,
                                    type: 'gradient',
                                    gradient: { ...config.gradient, direction: val as any }
                                })
                            }
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GRADIENT_DIRECTIONS.map((dir) => (
                                    <SelectItem key={dir.value} value={dir.value}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-gradient-${dir.value} from-blue-400 to-purple-600`} />
                                            {dir.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>Start Color</Label>
                        <Select
                            value={config.gradient?.from || 'none'}
                            onValueChange={(val) =>
                                handleChange({
                                    ...config,
                                    type: 'gradient',
                                    gradient: { ...config.gradient, from: val === 'none' ? undefined : val }
                                })
                            }
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue placeholder='Select start color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>
                                    <div className='flex items-center gap-2'>
                                        <div className='border border-dashed rounded w-4 h-4' />
                                        <span className='text-muted-foreground'>None</span>
                                    </div>
                                </SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border shadow-sm`} />
                                            <span className='font-mono text-xs'>{color}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='flex items-center gap-2 font-medium text-muted-foreground text-xs'>
                            Middle Color
                            <span className='font-normal text-[10px] italic'>(optional)</span>
                        </Label>
                        <Select
                            value={config.gradient?.via || 'none'}
                            onValueChange={(val) =>
                                handleChange({
                                    ...config,
                                    type: 'gradient',
                                    gradient: { ...config.gradient, via: val === 'none' ? undefined : val }
                                })
                            }
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue placeholder='Select middle color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>
                                    <div className='flex items-center gap-2'>
                                        <div className='border border-dashed rounded w-4 h-4' />
                                        <span className='text-muted-foreground'>Skip middle color</span>
                                    </div>
                                </SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border shadow-sm`} />
                                            <span className='font-mono text-xs'>{color}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>End Color</Label>
                        <Select
                            value={config.gradient?.to || 'none'}
                            onValueChange={(val) =>
                                handleChange({
                                    ...config,
                                    type: 'gradient',
                                    gradient: { ...config.gradient, to: val === 'none' ? undefined : val }
                                })
                            }
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue placeholder='Select end color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>
                                    <div className='flex items-center gap-2'>
                                        <div className='border border-dashed rounded w-4 h-4' />
                                        <span className='text-muted-foreground'>None</span>
                                    </div>
                                </SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border shadow-sm`} />
                                            <span className='font-mono text-xs'>{color}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Gradient Preview */}
                    {(config.gradient?.from || config.gradient?.to) && (
                        <div className='bg-muted/30 mt-4 p-4 border rounded-lg'>
                            <Label className='block mb-2 font-medium text-muted-foreground text-xs'>Preview</Label>
                            <div className={`h-20 rounded-md bg-gradient-${config.gradient?.direction || 'to-r'} ${config.gradient?.from ? `from-${config.gradient.from}` : ''} ${config.gradient?.via ? `via-${config.gradient.via}` : ''} ${config.gradient?.to ? `to-${config.gradient.to}` : ''} shadow-md`} />
                        </div>
                    )}
                </TabsContent>

                {/* IMAGE */}
                <TabsContent value='image' className='space-y-4 pt-4'>
                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>Image URL</Label>
                        <Input
                            placeholder='/images/background.jpg'
                            value={config.image?.url || ''}
                            onChange={(e) =>
                                handleChange({
                                    ...config,
                                    type: 'image',
                                    image: { ...config.image, url: e.target.value }
                                })
                            }
                            className='font-mono text-sm'
                        />
                        <p className='text-[10px] text-muted-foreground'>Enter the path to your background image</p>
                    </div>

                    <div className='gap-3 grid grid-cols-2'>
                        <div className='space-y-2'>
                            <Label className='font-medium text-muted-foreground text-xs'>Size</Label>
                            <Select
                                value={config.image?.size || 'cover'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        type: 'image',
                                        image: { ...config.image, size: val as any }
                                    })
                                }
                            >
                                <SelectTrigger className='h-10'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='cover'>
                                        <div className='flex flex-col items-start'>
                                            <span className='font-medium'>Cover</span>
                                            <span className='text-[10px] text-muted-foreground'>Fill entire space</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value='contain'>
                                        <div className='flex flex-col items-start'>
                                            <span className='font-medium'>Contain</span>
                                            <span className='text-[10px] text-muted-foreground'>Fit inside space</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value='auto'>
                                        <div className='flex flex-col items-start'>
                                            <span className='font-medium'>Auto</span>
                                            <span className='text-[10px] text-muted-foreground'>Original size</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label className='font-medium text-muted-foreground text-xs'>Position</Label>
                            <Select
                                value={config.image?.position || 'center'}
                                onValueChange={(val) =>
                                    handleChange({
                                        ...config,
                                        type: 'image',
                                        image: { ...config.image, position: val as any }
                                    })
                                }
                            >
                                <SelectTrigger className='h-10'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='center'>Center</SelectItem>
                                    <SelectItem value='top'>Top</SelectItem>
                                    <SelectItem value='bottom'>Bottom</SelectItem>
                                    <SelectItem value='left'>Left</SelectItem>
                                    <SelectItem value='right'>Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label className='font-medium text-muted-foreground text-xs'>Repeat</Label>
                        <Select
                            value={config.image?.repeat || 'no-repeat'}
                            onValueChange={(val) =>
                                handleChange({
                                    ...config,
                                    type: 'image',
                                    image: { ...config.image, repeat: val as any }
                                })
                            }
                        >
                            <SelectTrigger className='h-10'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='repeat'>Repeat (Tile)</SelectItem>
                                <SelectItem value='no-repeat'>No Repeat (Once)</SelectItem>
                                <SelectItem value='repeat-x'>Repeat Horizontally</SelectItem>
                                <SelectItem value='repeat-y'>Repeat Vertically</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='bg-amber-50 dark:bg-amber-950/20 p-3 border border-amber-200 dark:border-amber-800 rounded-lg'>
                        <p className='text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed'>
                            <strong>Note:</strong> Background images are applied via inline styles (not Tailwind classes) to support dynamic URLs.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Generated Classes Preview */}
            <div className='space-y-2'>
                <Label className='flex items-center gap-2 font-medium text-muted-foreground text-xs'>
                    Generated Tailwind Classes
                </Label>
                <div className='bg-muted/50 p-3 border border-muted rounded-lg'>
                    <code className='font-mono text-foreground text-xs break-all'>
                        {generateBackgroundClasses(config) || <span className='text-muted-foreground italic'>No classes generated yet</span>}
                    </code>
                </div>
            </div>
        </div>
    )
}
