'use client'

import LogoManagement from '@/components/admin/form/settings/LogoManagement'
import CustomImage from '@/components/common/CustomImage'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

// ImageCard component
const ImageCard = ({ value, name }: { value: string; name: string }) => (
  <Card title='Media'>
    <CardHeader>
      <CardTitle className='capitalize'>{name}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className='flex justify-center items-center w-full aspect-square'>
        <div className='relative w-full min-w-44 h-20 overflow-hidden'>
          <CustomImage src={value} alt={name} fill className='size-auto object-contain' />
        </div>
      </div>
    </CardContent>
  </Card>
)

// MediaBlock for logo and favicon rendering
const MediaBlock = ({ siteConfig }: { siteConfig: SiteSettings }) => (
  <div className='flex gap-4'>
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
      <Card className='bg-foreground mt-6 border-primary border-dashed'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-primary'>
            <AlertCircle className='w-5 h-5' />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2 text-muted text-sm'>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Logo variants:</strong> Upload different logo versions (light, dark, etc.)
                for optimal display across various themes and backgrounds.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Favicon:</strong> Recommended size is 32x32 or 16x16 pixels. Use PNG, ICO,
                or SVG format for best browser compatibility.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>File formats:</strong> PNG with transparent background is recommended for
                logos. JPG, SVG, and WebP are also supported.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Image quality:</strong> Use high-resolution images to ensure crisp display
                on retina and high-DPI screens.
              </span>
            </li>
            <li className='flex gap-2'>
              <span className='font-semibold'>•</span>
              <span>
                <strong>Cache clearing:</strong> After updating logos, you may need to clear your
                browser cache or perform a hard refresh (Ctrl+F5) to see changes.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
