'use client'

import { useMemo, useState } from 'react'

import ThemeSettings, {
  DEFAULT_THEME_COLOR_MAP,
  THEME_COLOR_SECTIONS
} from '@/components/admin/form/settings/ThemeSettings'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { AlertCircle, Palette } from 'lucide-react'

type ThemeColorKey = keyof NonNullable<NonNullable<SiteSettings['theme']>['color']>

const resolveColorValue = (theme: SiteSettings['theme'] | undefined, key: ThemeColorKey) => {
  const raw = theme?.color?.[key]
  if (typeof raw === 'string' && raw.trim()) {
    return raw.trim().toUpperCase()
  }
  return DEFAULT_THEME_COLOR_MAP[key]
}

const ThemePreview = ({ theme }: { theme?: SiteSettings['theme'] }) => {
  const colorSummary = useMemo(() => {
    return THEME_COLOR_SECTIONS.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        value: resolveColorValue(theme, item.key)
      }))
    }))
  }, [theme])

  return (
    <div className='space-y-6'>
      {colorSummary.map((section) => (
        <Card key={section.id}>
          <CardHeader className='pb-4'>
            <div className='flex items-start gap-3'>
              <div className='bg-primary/10 mt-0.5 p-2 rounded-md text-primary'>
                <Palette className='w-4 h-4' />
              </div>
              <div>
                <CardTitle className='font-semibold text-base'>{section.title}</CardTitle>
                <p className='text-muted-foreground text-xs'>{section.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='gap-4 grid sm:grid-cols-2 xl:grid-cols-4'>
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className='flex flex-col justify-between gap-y-2 bg-muted/10 shadow-sm p-4 border border-border/60 rounded-lg'
                >
                  <div className="space-y-0.5">
                    <div className='flex justify-between items-center gap-2'>
                      <span className='font-medium text-foreground text-sm'>{item.label}</span>
                      <Badge variant='outline' className='font-mono text-[11px] uppercase'>
                        {item.value}
                      </Badge>
                    </div>
                    <p className='text-muted-foreground text-xs'>{item.hint}</p>
                  </div>
                  <div className='gap-3 space-x-1.5 pt-2 flex_items-center'>
                    <span
                      className='float-start shadow-sm border border-border rounded-md w-12 h-12 aspect-square'
                      style={{ backgroundColor: item.value }}
                    />
                    <div className='space-y-1 text-[11px] text-muted-foreground'>
                      <p>
                        <strong>Preview:</strong> Buttons, badges & surface accents that use this
                        color inherit updates instantly.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main component
export default function ThemeSettingsPage() {
  const [edit, setEdit] = useState(false)
  const settingsKey = 'system_site_settings'
  const { data, mutate, loading } = useAsync<SettingsData<SiteSettings>>(
    () => `/admin/setting/settings/key/${settingsKey}`,
    true
  )

  const siteConfig = data?.data?.value ?? undefined
  const onClose = () => {
    mutate()
    setEdit(false)
  }

  return (
    <>
      <PageHeader
        title='Theme Settings'
        subTitle='Curate the color system that powers the admin and marketing surfaces.'
        extra={
          siteConfig && (
            <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
              {edit ? 'Cancel' : 'Update'}
            </Button>
          )
        }
      />

      {!siteConfig || edit ? (
        <ThemeSettings settingsKey={settingsKey} initialValues={siteConfig} refetch={onClose} />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : siteConfig ? (
        <div className='space-y-6'>
          <ThemePreview theme={siteConfig.theme} />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Important Notes Section */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 font-semibold text-base'>
            <AlertCircle className='w-5 h-5 text-primary' />
            Theme Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2 text-muted-foreground text-sm'>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Contrast first:</strong> Aim for a minimum contrast ratio of 4.5:1 between
                header/footer backgrounds and their text colors for accessibility.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Brand alignment:</strong> Use the official HEX codes supplied by your design
                team to keep marketing pages and the admin panel unified.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Surface updates:</strong> Header and footer colors apply across the entire
                site, including mobile navigation and marketing sections.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Preview before publish:</strong> After saving, reload a few public pages to
                confirm the palette feels coherent in real content contexts.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Share updates:</strong> Inform the marketing and content teams when colors
                change so they can adjust imagery and copy if needed.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
