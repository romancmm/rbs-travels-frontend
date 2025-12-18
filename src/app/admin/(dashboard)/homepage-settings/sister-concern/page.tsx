'use client'

import { useState } from 'react'

import SisterConcern from '@/components/admin/form/settings/home/SisterConcern'
import { EmptyState } from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import RenderData from '@/components/common/RenderData'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import type { SisterConcernSettings } from '@/lib/validations/schemas/sisterConcernSettings'

type SettingsData<T> = {
  data: {
    value: T
  }
}

// Main component
export default function SisterConcernConfigPage() {
  const [edit, setEdit] = useState(false)
  const settingsKey = 'home_sister_concern_settings'
  const { data, mutate, loading } = useAsync<SettingsData<SisterConcernSettings>>(
    () => `/admin/setting/settings/key/${settingsKey}`,
    true
  )
  const sisterConcernConfig = data?.data?.value ?? undefined
  const onClose = () => {
    mutate()
    setEdit(false)
  }

  return (
    <>
      <PageHeader
        title='Sister Concern Companies'
        subTitle='Manage sister concern companies displayed on the homepage'
        extra={
          <Button variant={edit ? 'destructive' : 'default'} onClick={() => setEdit(!edit)}>
            {edit ? 'Cancel' : 'Update'}
          </Button>
        }
      />

      {edit ? (
        <SisterConcern
          settingsKey={settingsKey}
          initialValues={sisterConcernConfig}
          refetch={onClose}
        />
      ) : loading ? (
        Array.from({ length: 2 }).map((_, idx) => <Skeleton className='my-8' key={idx} />)
      ) : sisterConcernConfig ? (
        <div className='space-y-6'>
          {sisterConcernConfig.companies && sisterConcernConfig.companies.length > 0 ? (
            <RenderData data={sisterConcernConfig} excludedFields={[]} />
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
