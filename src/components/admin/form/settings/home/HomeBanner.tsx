'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { homeBannerFields, DEFAULT_BANNER } from '@/config/forms/homeBanner'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import {
  homepageSettingsSchema,
  type HomepageSettings
} from '@/lib/validations/schemas/homepageSettings'
import { HOME_CONFIG } from '@/types/cache-keys'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: HomepageSettings | undefined
  refetch?: () => void
}

const HomeBanner = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      ...initialValues,
      banners: initialValues?.banners || [DEFAULT_BANNER]
    }),
    [initialValues]
  )

  const form = useSettingsForm<HomepageSettings>({
    schema: homepageSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: HOME_CONFIG,
    refetch
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-6'>
      <DynamicForm form={form} fields={homeBannerFields} />

      <FormSubmitButton
        size='lg'
        isSubmitting={form.formState.isSubmitting}
        isEditing={form.isEditing}
        createLabel='Save Banners'
        updateLabel='Update Banners'
      />
    </form>
  )
}

export default HomeBanner
