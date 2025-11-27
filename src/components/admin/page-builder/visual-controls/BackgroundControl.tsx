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
                <Label className='flex items-center gap-2'>
                    <Paintbrush className='w-4 h-4' />
                    Background
                </Label>
                <Button variant='ghost' size='sm' onClick={handleClear}>
                    <X className='w-4 h-4' />
                </Button>
            </div>

            <Tabs value={config.type || 'color'} onValueChange={(val) => handleChange({ ...config, type: val as any })}>
                <TabsList className='grid grid-cols-3 w-full'>
                    <TabsTrigger value='color'>Color</TabsTrigger>
                    <TabsTrigger value='gradient'>Gradient</TabsTrigger>
                    <TabsTrigger value='image'>Image</TabsTrigger>
                </TabsList>

                {/* COLOR */}
                <TabsContent value='color' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Select Color</Label>
                        <Select
                            value={config.color || 'none'}
                            onValueChange={(val) => handleChange({ ...config, type: 'color', color: val === 'none' ? undefined : val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Choose color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>None</SelectItem>
                                {COLOR_PRESETS.map((preset) => (
                                    <SelectItem key={preset.value} value={preset.value}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded ${preset.value} border`} />
                                            {preset.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Or Use Custom (e.g., bg-[#ff0000])</Label>
                        <Input
                            placeholder='bg-[#ff0000]'
                            value={config.color || ''}
                            onChange={(e) => handleChange({ ...config, type: 'color', color: e.target.value })}
                        />
                    </div>
                </TabsContent>

                {/* GRADIENT */}
                <TabsContent value='gradient' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Direction</Label>
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
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {GRADIENT_DIRECTIONS.map((dir) => (
                                    <SelectItem key={dir.value} value={dir.value}>
                                        {dir.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>From Color</Label>
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
                            <SelectTrigger>
                                <SelectValue placeholder='Start color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>None</SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border`} />
                                            {color}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Via Color (Optional)</Label>
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
                            <SelectTrigger>
                                <SelectValue placeholder='Middle color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>None</SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border`} />
                                            {color}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>To Color</Label>
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
                            <SelectTrigger>
                                <SelectValue placeholder='End color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>None</SelectItem>
                                {COLOR_OPTIONS.map((color) => (
                                    <SelectItem key={color} value={color}>
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-4 h-4 rounded bg-${color} border`} />
                                            {color}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>

                {/* IMAGE */}
                <TabsContent value='image' className='space-y-3'>
                    <div className='space-y-2'>
                        <Label className='text-xs'>Image URL</Label>
                        <Input
                            placeholder='/images/bg.jpg'
                            value={config.image?.url || ''}
                            onChange={(e) =>
                                handleChange({
                                    ...config,
                                    type: 'image',
                                    image: { ...config.image, url: e.target.value }
                                })
                            }
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Size</Label>
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
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='cover'>Cover</SelectItem>
                                <SelectItem value='contain'>Contain</SelectItem>
                                <SelectItem value='auto'>Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label className='text-xs'>Position</Label>
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
                            <SelectTrigger>
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

                    <div className='space-y-2'>
                        <Label className='text-xs'>Repeat</Label>
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
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='repeat'>Repeat</SelectItem>
                                <SelectItem value='no-repeat'>No Repeat</SelectItem>
                                <SelectItem value='repeat-x'>Repeat X</SelectItem>
                                <SelectItem value='repeat-y'>Repeat Y</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Preview */}
            <div className='bg-muted p-2 rounded font-mono text-muted-foreground text-xs'>
                {generateBackgroundClasses(config) || 'No background applied'}
            </div>
        </div>
    )
}
