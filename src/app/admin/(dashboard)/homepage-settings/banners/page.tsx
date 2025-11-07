'use client'

import { useState } from 'react'

import HomeBanner from '@/components/admin/form/settings/home/HomeBanner'
import CustomImage from '@/components/common/CustomImage'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'

type SettingsData<T> = {
  data: {
    value: T
  }
}

// Main component
export default function HomeConfigPage() {
  const [edit, setEdit] = useState(false)
  const settingsKey = 'homepage_settings'
  const { data, mutate, loading } = useAsync<SettingsData<HomepageSettings>>(
    () => `/admin/setting/settings/key/${settingsKey}`,
    true
  )
  const homeConfig = data?.data?.value ?? undefined
  const onClose = () => {
    mutate()
    setEdit(false)
  }

  return (
    <>
      <PageHeader
        title='Homepage Configuration'
        subTitle='Manage homepage settings and content'
        extra={
          <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
            {edit ? 'Cancel' : 'Update'}
          </Button>
        }
      />

      {edit ? (
        <HomeBanner settingsKey={settingsKey} initialValues={homeConfig} refetch={onClose} />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : homeConfig ? (
        <div className='space-y-6'>
          {/* Banners Overview */}
          {homeConfig.banners && homeConfig.banners.length > 0 ? (
            <>
              {/* Banners Grid */}
              <div className='gap-6 grid grid-cols-1 lg:grid-cols-2'>
                {homeConfig.banners.map((banner, index) => (
                  <Card key={index} className='hover:shadow-lg overflow-hidden transition-shadow'>
                    <CardHeader className='space-y-1'>
                      <div className='flex justify-between items-start'>
                        <CardTitle className='text-base'>Banner {index + 1}</CardTitle>
                        <div className='flex items-center gap-2'>
                          <Badge
                            variant={banner.isActive ? 'default' : 'secondary'}
                            className='text-xs'
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant='outline' className='text-xs'>
                            Slide {index + 1}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      {/* Banner Image Preview */}
                      {banner.bgImage ? (
                        <div className='relative border rounded-lg w-full h-48 overflow-hidden'>
                          <CustomImage
                            src={banner.bgImage}
                            alt={banner.title || `Banner ${index + 1}`}
                            fill
                            className='object-cover'
                          />
                          <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-4'>
                            <div className='space-y-1 text-white'>
                              {banner.title && (
                                <h4 className='font-semibold text-lg line-clamp-1'>
                                  {banner.title}
                                </h4>
                              )}
                              {banner.subTitle && (
                                <p className='text-white/90 text-sm line-clamp-1'>
                                  {banner.subTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className='flex flex-col justify-center items-center bg-muted rounded-lg w-full h-48 text-muted-foreground'>
                          <ImageIcon className='mb-2 w-12 h-12' />
                          <span className='text-sm'>No background image</span>
                        </div>
                      )}

                      {/* Banner Details */}
                      <div className='space-y-3'>
                        {banner.title && (
                          <div>
                            <p className='mb-1 font-medium text-muted-foreground text-xs uppercase'>
                              Title
                            </p>
                            <p className='font-medium text-sm'>{banner.title}</p>
                          </div>
                        )}

                        {banner.subTitle && (
                          <div>
                            <p className='mb-1 font-medium text-muted-foreground text-xs uppercase'>
                              Subtitle
                            </p>
                            <p className='text-sm'>{banner.subTitle}</p>
                          </div>
                        )}

                        {banner.desc && (
                          <div>
                            <p className='mb-1 font-medium text-muted-foreground text-xs uppercase'>
                              Description
                            </p>
                            <p className='text-muted-foreground text-sm line-clamp-2'>
                              {banner.desc}
                            </p>
                          </div>
                        )}

                        {/* CTA Buttons */}
                        {banner.buttons && banner.buttons.length > 0 && (
                          <div>
                            <p className='mb-2 font-medium text-muted-foreground text-xs uppercase'>
                              Call-to-Action Buttons
                            </p>
                            <div className='flex flex-wrap gap-2'>
                              {banner.buttons.map((button, btnIndex) => (
                                <div
                                  key={btnIndex}
                                  className='inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors'
                                >
                                  <span className='font-medium text-primary text-sm'>
                                    {button.title}
                                  </span>
                                  {button.url && (
                                    <ExternalLink className='w-3 h-3 text-primary/70' />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        <div className='flex gap-4 pt-2 border-t text-muted-foreground text-xs'>
                          <div className='flex items-center gap-1'>
                            <ImageIcon className='w-3 h-3' />
                            <span>{banner.bgImage ? 'Has Image' : 'No Image'}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <ExternalLink className='w-3 h-3' />
                            <span>{banner.buttons?.length || 0} Button(s)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className='flex flex-col justify-center items-center py-12'>
                <ImageIcon className='mb-4 w-16 h-16 text-muted-foreground' />
                <h3 className='mb-2 font-semibold text-lg'>No Banners Configured</h3>
                <p className='mb-4 text-muted-foreground text-sm text-center'>
                  Click the &quot;Edit&quot; button above to add your first banner slide.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  )
}
