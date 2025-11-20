'use client'

import LogoManagement from '@/components/admin/form/settings/LogoManagement'
import CustomImage from '@/components/common/CustomImage'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useState } from 'react'

// ImageCard component with enhanced styling
const ImageCard = ({ value, name }: { value: string; name: string }) => {
  const isFavicon = name.toLowerCase().includes('favicon')
  const isDark = name.toLowerCase().includes('dark')

  return (
    <Card className='group relative hover:shadow-2xl border-2 hover:border-primary/30 overflow-hidden transition-all duration-500'>
      {/* Decorative gradient background */}
      <div className='absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

      {/* Decorative corner accent */}
      <div className='top-0 right-0 absolute bg-linear-to-br from-primary/20 to-transparent opacity-50 rounded-bl-full w-20 h-20' />

      <CardHeader className='relative pb-3'>
        <CardTitle className='flex justify-between items-center gap-2 font-semibold text-base'>
          <span className='flex items-center gap-2 capitalize'>
            {isFavicon ? (
              <Sparkles className='w-4 h-4 text-primary' />
            ) : (
              <ImageIcon className='w-4 h-4 text-primary' />
            )}
            {name}
          </span>
          <span className={cn(
            'px-2 py-0.5 rounded-full font-medium text-xs',
            isDark ? 'bg-gray-800 text-white' : isFavicon ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
          )}>
            {isDark ? 'Dark' : isFavicon ? 'Icon' : 'Light'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className='relative'>
        <div className={cn(
          'relative flex justify-center items-center p-8 rounded-xl transition-all duration-500',
          'bg-linear-to-br from-muted/50 via-muted/30 to-background',
          'border-2 border-dashed border-muted-foreground/20',
          'group-hover:border-primary/40 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5',
          'shadow-inner group-hover:shadow-primary/10'
        )}>
          {/* Floating decorative dots */}
          <div className='top-2 left-2 absolute bg-primary/20 group-hover:bg-primary/40 rounded-full w-2 h-2 transition-colors' />
          <div className='right-2 bottom-2 absolute bg-primary/20 group-hover:bg-primary/40 rounded-full w-2 h-2 transition-colors' />

          <div className='relative w-full max-w-[200px] h-24 group-hover:scale-105 transition-transform duration-500'>
            <CustomImage src={value} alt={name} fill className='drop-shadow-lg object-contain' />
          </div>
        </div>

        {/* Hover effect bar */}
        <div className='right-0 bottom-0 left-0 absolute bg-linear-to-r from-primary/0 via-primary to-primary/0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
      </CardContent>
    </Card>
  )
}

// MediaBlock for logo and favicon rendering
const MediaBlock = ({ siteConfig }: { siteConfig: SiteSettings }) => (
  <div className='space-y-6'>
    {/* Section Header */}
    <div className='relative'>
      <div className='flex items-center gap-3'>
        <div className='bg-primary/10 p-2 rounded-lg'>
          <ImageIcon className='w-5 h-5 text-primary' />
        </div>
        <div>
          <h2 className='font-bold text-foreground text-xl'>Current Media Assets</h2>
          <p className='text-muted-foreground text-sm'>Your uploaded logos and favicon</p>
        </div>
      </div>
      <div className='-bottom-2 left-0 absolute bg-linear-to-r from-primary to-primary/0 rounded-full w-20 h-1' />
    </div>

    {/* Cards Grid */}
    <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
      {(['logo', 'favicon'] as const).flatMap((key) => {
        const value = siteConfig[key]

        if (key === 'logo' && typeof value === 'object' && value !== null) {
          return Object.entries(value).map(([variant, url], idx) => (
            <ImageCard
              value={url as string}
              name={`${key} ${variant}`}
              key={`${key}-${variant}-${idx}`}
            />
          ))
        }

        if (key === 'favicon' && typeof value === 'string') {
          return <ImageCard key={key} value={value} name={key} />
        }

        return []
      })}
    </div>
  </div>
)

// Main component
export default function SiteConfigPage() {
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
        title='Site Configuration'
        subTitle='Manage your site settings'
        extra={
          siteConfig && (
            <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
              {edit ? 'Cancel' : 'Edit'}
            </Button>
          )
        }
      />

      {!siteConfig || edit ? (
        <LogoManagement settingsKey={settingsKey} initialValues={siteConfig} refetch={onClose} />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : siteConfig ? (
        <div className='space-y-10!'>
          <MediaBlock siteConfig={siteConfig} />
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Important Notes Section */}
      <Card className='relative bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 mt-8 border-2 border-primary/20 overflow-hidden'>
        {/* Decorative gradient overlay */}
        <div className='absolute inset-0 bg-linear-to-br from-transparent via-white/50 to-transparent pointer-events-none' />

        {/* Decorative circles */}
        <div className='-top-20 -right-20 absolute bg-primary/10 blur-3xl rounded-full w-40 h-40' />
        <div className='-bottom-20 -left-20 absolute bg-primary/10 blur-3xl rounded-full w-40 h-40' />

        <CardHeader className='relative'>
          <CardTitle className='flex items-center gap-3'>
            <div className='bg-primary/20 p-2 rounded-lg'>
              <AlertCircle className='w-5 h-5 text-primary' />
            </div>
            <span className='font-bold text-primary text-lg'>Important Notes</span>
          </CardTitle>
        </CardHeader>

        <CardContent className='relative'>
          <ul className='space-y-2 text-foreground/90 text-sm'>
            <li className='flex items-start gap-3 bg-white/50 hover:bg-white/80 p-3 rounded-lg transition-colors duration-300'>
              <span className='flex justify-center items-center bg-blue-500 mt-0.5 rounded-full w-6 h-6 font-bold text-white text-xs shrink-0'>1</span>
              <span>
                <strong className='text-foreground'>Logo variants:</strong> Upload different logo versions (light, dark, etc.)
                for optimal display across various themes and backgrounds.
              </span>
            </li>
            <li className='flex items-start gap-3 bg-white/50 hover:bg-white/80 p-3 rounded-lg transition-colors duration-300'>
              <span className='flex justify-center items-center bg-purple-500 mt-0.5 rounded-full w-6 h-6 font-bold text-white text-xs shrink-0'>2</span>
              <span>
                <strong className='text-foreground'>Favicon:</strong> Recommended size is 32x32 or 16x16 pixels. Use PNG, ICO,
                or SVG format for best browser compatibility.
              </span>
            </li>
            <li className='flex items-start gap-3 bg-white/50 hover:bg-white/80 p-3 rounded-lg transition-colors duration-300'>
              <span className='flex justify-center items-center bg-emerald-500 mt-0.5 rounded-full w-6 h-6 font-bold text-white text-xs shrink-0'>3</span>
              <span>
                <strong className='text-foreground'>File formats:</strong> PNG with transparent background is recommended for
                logos. JPG, SVG, and WebP are also supported.
              </span>
            </li>
            <li className='flex items-start gap-3 bg-white/50 hover:bg-white/80 p-3 rounded-lg transition-colors duration-300'>
              <span className='flex justify-center items-center bg-amber-500 mt-0.5 rounded-full w-6 h-6 font-bold text-white text-xs shrink-0'>4</span>
              <span>
                <strong className='text-foreground'>Image quality:</strong> Use high-resolution images to ensure crisp display
                on retina and high-DPI screens.
              </span>
            </li>
            <li className='flex items-start gap-3 bg-white/50 hover:bg-white/80 p-3 rounded-lg transition-colors duration-300'>
              <span className='flex justify-center items-center bg-rose-500 mt-0.5 rounded-full w-6 h-6 font-bold text-white text-xs shrink-0'>5</span>
              <span>
                <strong className='text-foreground'>Cache clearing:</strong> After updating logos, you may need to clear your
                browser cache or perform a hard refresh (Ctrl+F5) to see changes.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
