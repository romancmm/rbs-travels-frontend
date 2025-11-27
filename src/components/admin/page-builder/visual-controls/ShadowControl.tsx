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
            <Label className='flex items-center gap-2'>
                <Droplet className='w-4 h-4' />
                Shadow
            </Label>

            <div className='space-y-2'>
                <Select value={preset} onValueChange={handleChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SHADOW_PRESETS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Preview */}
            <div className='bg-muted p-2 rounded font-mono text-muted-foreground text-xs'>
                {generateShadowClass(preset)}
            </div>

            {/* Visual Preview */}
            <div className='flex justify-center p-6'>
                <div className={`bg-white rounded-lg w-24 h-24 ${generateShadowClass(preset)}`} />
            </div>
        </div>
    )
}
