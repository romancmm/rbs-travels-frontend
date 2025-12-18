'use client'

import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { revalidateTags } from '@/action/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { showError } from '@/lib/errMsg'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

type ThemeColorKey = keyof NonNullable<NonNullable<SiteSettings['theme']>['color']>
type ThemeColorControllerName = `theme.color.${ThemeColorKey}`

export const DEFAULT_THEME_COLOR_MAP: Record<ThemeColorKey, string> = {
  primary: '#1677FF',
  secondary: '#13C2C2',
  accent: '#FAAD14',
  text: '#1F1F1F',
  'header-background': '#F5F5F5',
  'header-color': '#1F1F1F',
  'footer-background': '#001529',
  'footer-color': '#FFFFFF'
}

const COLOR_PRESETS = [
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

const HEX_COLOR_REGEX = /^#([0-9A-F]{6})$/i

const ensureHex = (value: string | null | undefined, fallback: string) => {
  if (typeof value === 'string' && HEX_COLOR_REGEX.test(value.trim())) {
    return value.trim().toUpperCase()
  }
  return fallback.toUpperCase()
}

const normalizeHexInput = (rawValue: string) => {
  const cleaned = rawValue.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6)
  return `#${cleaned}`.toUpperCase()
}

export const THEME_COLOR_SECTIONS: ReadonlyArray<{
  id: 'brand' | 'interface'
  title: string
  description: string
  items: ReadonlyArray<{ key: ThemeColorKey; label: string; hint: string }>
}> = [
    {
      id: 'brand',
      title: 'Brand Palette',
      description: 'Primary accents used across CTAs, highlights, and typography.',
      items: [
        { key: 'primary', label: 'Primary', hint: 'Buttons, active states, key brand actions' },
        { key: 'secondary', label: 'Secondary', hint: 'Alternate accents and supporting UI' },
        { key: 'accent', label: 'Accent', hint: 'Highlights, badges, and subtle emphasis' },
        { key: 'text', label: 'Body Text', hint: 'Default body typography color' }
      ]
    },
    {
      id: 'interface',
      title: 'Interface Surfaces',
      description: 'Header and footer backgrounds, along with their contrasting text colors.',
      items: [
        { key: 'header-background', label: 'Header Background', hint: 'Navigation bar background color' },
        { key: 'header-color', label: 'Header Text', hint: 'Links and icons on the header' },
        { key: 'footer-background', label: 'Footer Background', hint: 'Footer surface color' },
        { key: 'footer-color', label: 'Footer Text', hint: 'Content and links in the footer' }
      ]
    }
  ]

const COLOR_CONFIGS = THEME_COLOR_SECTIONS.flatMap((section) => section.items)

const ThemeSettings = ({ settingsKey, initialValues, refetch }: TProps) => {
  const themeColorDefaults = useMemo(() => {
    const base = {} as Record<ThemeColorKey, string>
    COLOR_CONFIGS.forEach(({ key }) => {
      base[key] = ensureHex(initialValues?.theme?.color?.[key] as string | null | undefined, DEFAULT_THEME_COLOR_MAP[key])
    })
    return base
  }, [initialValues])

  const {
    handleSubmit,
    control,
    formState: { isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ...initialValues,
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      },
      theme: {
        ...initialValues?.theme,
        color: {
          ...themeColorDefaults
        }
      }
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests[initialValues ? 'put' : 'post'](
        `/admin/setting/settings/${initialValues ? `key/${settingsKey}` : ''}`,
        {
          key: settingsKey,
          value: data
        }
      )
      if (res?.success) {
        await revalidateTags(SITE_CONFIG)
        toast.success('Settings updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='capitalize'>Theme Colors</CardTitle>
            <CardDescription>
              Adjust your brand palette and interface surfaces to keep the admin experience on
              brand. Updates apply instantly after saving.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              {THEME_COLOR_SECTIONS.map((section) => (
                <div key={section.id} className='space-y-4'>
                  <div>
                    <h3 className='font-semibold text-foreground text-sm'>{section.title}</h3>
                    <p className='text-muted-foreground text-xs'>{section.description}</p>
                  </div>
                  <div className='gap-4 grid sm:grid-cols-2 xl:grid-cols-4'>
                    {section.items.map((item) => (
                      <Controller
                        key={item.key}
                        control={control}
                        name={`theme.color.${item.key}` as ThemeColorControllerName}
                        render={({ field }) => (
                          <ThemeColorPicker
                            label={item.label}
                            hint={item.hint}
                            value={typeof field.value === 'string' ? field.value : themeColorDefaults[item.key]}
                            fallbackValue={DEFAULT_THEME_COLOR_MAP[item.key]}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' className='w-full sm:w-auto'>
          {isSubmitting ? 'Saving theme...' : initialValues ? 'Save Theme Updates' : 'Create Theme'}
        </Button>
      </div>
    </form>
  )
}

export default ThemeSettings

type ThemeColorPickerProps = {
  label: string
  hint?: string
  value: string
  fallbackValue: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const ThemeColorPicker = ({
  label,
  hint,
  value,
  fallbackValue,
  onChange,
  onBlur
}: ThemeColorPickerProps) => {
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
      <div className='flex justify-between items-center gap-2'>
        <span className='font-medium text-muted-foreground text-xs uppercase tracking-wide'>
          {label}
        </span>
      </div>
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
            <span className='font-medium text-sm'>{label} Color</span>
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
              aria-label={`${label} color picker`}
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
              {COLOR_PRESETS.map((preset) => (
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
