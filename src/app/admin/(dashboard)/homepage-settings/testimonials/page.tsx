'use client'

import { useState } from 'react'

import HomeTestimonial from '@/components/admin/form/settings/home/HomeTestimonial'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import RenderData from '@/components/common/RenderData'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { TestimonialSettings } from '@/lib/validations/schemas/testimonialSettings'

type SettingsData<T> = {
  data: {
    value: T
  }
}

// Main component
export default function TestimonialsConfigPage() {
  const [edit, setEdit] = useState(false)
  const settingsKey = 'home_testimonial_settings'
  const { data, mutate, loading } = useAsync<SettingsData<TestimonialSettings>>(
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
        title='Testimonials'
        subTitle='Manage the testimonials section displayed on the homepage'
        extra={
          <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
            {edit ? 'Cancel' : 'Update'}
          </Button>
        }
      />

      {edit ? (
        <HomeTestimonial settingsKey={settingsKey} initialValues={homeConfig} refetch={onClose} />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : homeConfig ? (
        <div className='space-y-6'>
          {homeConfig.testimonials ? (
            <RenderData data={homeConfig} excludedFields={[]} />
          ) : (
            <EmptyState />
          )}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  )
}
