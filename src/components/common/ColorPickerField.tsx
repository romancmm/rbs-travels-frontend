'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

export const HEX_COLOR_REGEX = /^#([0-9A-F]{6})$/i

export const ensureHex = (value: string | null | undefined, fallback: string) => {
  if (typeof value === 'string' && HEX_COLOR_REGEX.test(value.trim())) {
    return value.trim().toUpperCase()
  }
  return fallback.toUpperCase()
}

export const normalizeHexInput = (rawValue: string) => {
  const cleaned = rawValue.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6)
  return `#${cleaned}`.toUpperCase()
}

export const DEFAULT_COLOR_PRESETS = [
  '#1677FF',
  '#1890FF',
  '#13C2C2',
  '#52C41A',
  '#73D13D',
  '#F6FF00',
  '#FAAD14',
  '#F5222D',
  '#FF4D4F',
  '#EB2F96',
  '#722ED1',
  '#2F54EB',
  '#597EF7',
  '#8C8C8C',
  '#262626',
  '#000000'
]

type ColorPickerFieldProps = {
  label?: string
  hint?: string
  value?: string | null
  fallbackValue?: string
  presets?: string[]
  onChange: (value: string) => void
  onBlur?: () => void
}

export const ColorPickerField = ({
  label,
  hint,
  value,
  fallbackValue = '#000000',
  presets = DEFAULT_COLOR_PRESETS,
  onChange,
  onBlur
}: ColorPickerFieldProps) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || fallbackValue)

  useEffect(() => {
    setInputValue((value || fallbackValue).toUpperCase())
  }, [value, fallbackValue])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      onBlur?.()
    }
  }

  const commitColor = (hexValue: string) => {
    const formatted = ensureHex(hexValue, fallbackValue)
    setInputValue(formatted)
    onChange(formatted)
    onBlur?.()
  }

  const handleHexInput = (raw: string) => {
    const formatted = normalizeHexInput(raw)
    setInputValue(formatted.toUpperCase())
    if (HEX_COLOR_REGEX.test(formatted)) {
      onChange(formatted.toUpperCase())
    }
  }

  const displayColor = ensureHex(value, fallbackValue)
  const canReset = displayColor !== ensureHex(fallbackValue, fallbackValue)

  return (
    <div className='space-y-1 bg-muted/10 shadow-sm p-3 border border-border/60 rounded-lg'>
      {label && (
        <div className='flex justify-between items-center gap-2'>
          <span className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>
            {label}
          </span>
        </div>
      )}
      {hint && <p className='text-[11px] text-muted-foreground'>{hint}</p>}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type='button'
            className='flex justify-between items-center bg-background shadow-sm px-3 border border-border hover:border-primary rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full h-10 text-sm text-left transition-colors'
          >
            <span className='flex items-center gap-2'>
              <span
                className='shadow-sm border border-border rounded w-6 h-6'
                style={{ backgroundColor: displayColor }}
              />
              <span className='font-mono text-foreground text-xs uppercase'>{displayColor}</span>
            </span>
            <ChevronDown className='w-4 h-4 text-muted-foreground' />
          </button>
        </PopoverTrigger>
        <PopoverContent className='space-y-4 w-64' align='start' sideOffset={8}>
          <div className='flex justify-between items-center'>
            <span className='font-medium text-sm'>{label ? `${label} Color` : 'Color'}</span>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => commitColor(fallbackValue)}
              disabled={!canReset}
              className='px-2 h-8 text-xs'
            >
              <RotateCcw className='mr-1 w-3 h-3' /> Reset
            </Button>
          </div>

          <div className='flex items-center gap-3'>
            <input
              aria-label={`${label ?? 'Color'} picker`}
              type='color'
              value={displayColor}
              onChange={(event) => commitColor(event.target.value)}
              className='bg-transparent p-0 border border-border rounded-md w-12 h-12 cursor-pointer'
            />
            <div className='flex-1 space-y-1'>
              <span className='font-medium text-[10px] text-muted-foreground uppercase'>Hex</span>
              <Input
                value={inputValue}
                onChange={(event) => handleHexInput(event.target.value)}
                onBlur={() => onBlur?.()}
                spellCheck={false}
                maxLength={7}
                className='font-mono uppercase'
              />
            </div>
          </div>

          <div>
            <p className='mb-2 font-medium text-[10px] text-muted-foreground uppercase'>Presets</p>
            <div className='gap-2 grid grid-cols-8'>
              {presets.map((preset) => (
                <button
                  key={preset}
                  type='button'
                  className='border border-border rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 w-7 h-7 hover:scale-105 transition'
                  style={{ backgroundColor: preset }}
                  onClick={() => commitColor(preset)}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
