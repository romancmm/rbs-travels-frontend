/**
 * Shadow Control
 * Visual UI for configuring shadow with Tailwind classes
 */

'use client'

import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import type { ShadowPreset } from '@/lib/page-builder/tailwind-generator'
import { generateShadowClass } from '@/lib/page-builder/tailwind-generator'
import { Droplet } from 'lucide-react'
import { useState } from 'react'

const SHADOW_PRESETS: Array<{ label: string; value: ShadowPreset }> = [
    { label: 'None', value: 'none' },
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
    { label: 'Extra Large', value: 'xl' },
    { label: '2X Large', value: '2xl' },
    { label: 'Inner', value: 'inner' }
]

interface ShadowControlProps {
    value?: ShadowPreset
    onChange: (preset: ShadowPreset, className: string) => void
}

export function ShadowControl({ value = 'none', onChange }: ShadowControlProps) {
    const [preset, setPreset] = useState<ShadowPreset>(value)

    const handleChange = (newPreset: ShadowPreset) => {
        setPreset(newPreset)
        const className = generateShadowClass(newPreset)
        onChange(newPreset, className)
    }

    return (
        <div className='space-y-4'>
            <Label className='flex items-center gap-2 font-semibold text-sm'>
                <Droplet className='w-4 h-4 text-primary' />
                Shadow
            </Label>

            <div className='space-y-2'>
                <Label className='font-medium text-muted-foreground text-xs'>Shadow Intensity</Label>
                <Select value={preset} onValueChange={handleChange}>
                    <SelectTrigger className='h-10'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SHADOW_PRESETS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                <div className='flex items-center gap-2'>
                                    <div className={`w-8 h-8 rounded bg-white border ${generateShadowClass(item.value)}`} />
                                    <span>{item.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Visual Preview */}
            <div className='bg-muted/30 p-6 border rounded-lg'>
                <div className='flex justify-center'>
                    <div className={`bg-background rounded-lg w-24 h-24 flex items-center justify-center ${generateShadowClass(preset)}`}>
                        <span className='text-muted-foreground text-xs'>Preview</span>
                    </div>
                </div>
            </div>

            {/* Generated Class */}
            <div className='space-y-2'>
                <Label className='font-medium text-muted-foreground text-xs'>Generated Class</Label>
                <div className='bg-muted/50 p-3 border border-muted rounded-lg'>
                    <code className='font-mono text-foreground text-xs'>
                        {generateShadowClass(preset) || <span className='text-muted-foreground italic'>none</span>}
                    </code>
                </div>
            </div>
        </div>
    )
}
