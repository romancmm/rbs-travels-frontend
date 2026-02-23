'use client'

import { useState } from 'react'

import HomeServicesSection from '@/components/admin/form/settings/home/HomeServices'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import RenderData from '@/components/common/RenderData'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import type { HomepageSettings } from '@/lib/validations/schemas/homepageSettings'

type SettingsData<T> = {
  data: {
    value: T
  }
}

// Main component
export default function ServicesConfigPage() {
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
        title='Services'
        subTitle='Manage the services section displayed on the homepage'
        extra={
          <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
            {edit ? 'Cancel' : 'Update'}
          </Button>
        }
      />

      {edit ? (
        <HomeServicesSection
          settingsKey={settingsKey}
          initialValues={homeConfig}
          refetch={onClose}
        />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : homeConfig ? (
        <div className='space-y-6'>
          {homeConfig.services ? (
            <RenderData data={homeConfig.services} excludedFields={[]} />
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
