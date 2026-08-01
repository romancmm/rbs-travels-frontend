'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent } from '@/components/ui/card'
import { topCountriesFields } from '@/config/forms/topCountries'
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

const TopCountriesSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      ...initialValues,
      topCountries: {
        title: initialValues?.topCountries?.title || '',
        subtitle: initialValues?.topCountries?.subtitle || '',
        destinations: initialValues?.topCountries?.destinations || []
      }
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
      <Card>
        <CardContent>
          <DynamicForm form={form} fields={topCountriesFields} />
        </CardContent>
      </Card>

      <FormSubmitButton
        size='lg'
        isSubmitting={form.formState.isSubmitting}
        isEditing={form.isEditing}
        savingLabel='Submitting...'
      />
    </form>
  )
}

export default TopCountriesSection
