'use client'

import { useState } from 'react'

import SiteConfiguration from '@/components/admin/form/settings/SiteConfiguration'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import RenderData from '@/components/common/RenderData'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'

type KeyValueListProps = {
  data: Record<string, any>
}

// Color Component
const KeyValueList = ({ data }: KeyValueListProps) => {
  return (
    <Card title='Color Codes'>
      <CardHeader>
        <CardTitle>Color Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='gap-y-3 lg:gap-x-10 grid grid-cols-none xl:grid-cols-2 w-full xl:min-w-lg'>
          {Object.entries(data).map(([key, value]) => {
            const isColor = typeof value === 'string' // && /^#([0-9a-f]{3}){1,2}$/i.test(value)

            return (
              <div key={key} className='flex items-center gap-2'>
                <div className='min-w-20 font-medium text-xs capitalize'>
                  {key?.replace('_', ' ').toUpperCase()}
                </div>
                <span>:</span>

                {isColor ? (
                  <>
                    <div
                      className='rounded ring-1 ring-gray-300 min-w-6 size-6'
                      style={{ backgroundColor: value }}
                    />
                    <Badge variant='secondary'>{value}</Badge>
                  </>
                ) : (
                  <div>{String(value)}</div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

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
        <SiteConfiguration settingsKey={settingsKey} initialValues={siteConfig} refetch={onClose} />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : siteConfig ? (
        <div className='space-y-10!'>
          <RenderData
            title='Site Info'
            data={siteConfig}
            excludedFields={['logo', 'favicon', 'seo', 'header', 'footer', 'addresses', 'theme']}
          />

          {/* Addresses Card View */}
          {siteConfig?.addresses && siteConfig.addresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {siteConfig.addresses.map((address, index) => (
                    <Card key={index} className='bg-gray-50/50 border-gray-200'>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2 text-base'>
                          <Badge variant='secondary' className='text-xs'>
                            #{index + 1}
                          </Badge>
                          {address.title || `Address ${index + 1}`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-2 text-sm'>
                        {address.address && (
                          <div>
                            <div className='mb-1 font-medium text-gray-600 text-xs uppercase'>
                              Address:
                            </div>
                            <div className='text-gray-900'>{address.address}</div>
                          </div>
                        )}
                        {address.phone && (
                          <div className='flex items-center gap-2'>
                            <div className='font-medium text-gray-600 text-xs uppercase'>
                              Phone:
                            </div>
                            <div className='text-gray-900'>{address.phone}</div>
                          </div>
                        )}
                        {address.email && (
                          <div className='flex items-center gap-2'>
                            <div className='font-medium text-gray-600 text-xs uppercase'>
                              Email:
                            </div>
                            <div className='text-gray-900'>{address.email}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <RenderData title='Footer Info' data={siteConfig.footer ?? {}} />
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  )
}
