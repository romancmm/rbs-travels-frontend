'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent } from '@/components/ui/card'
import { logoManagementFields } from '@/config/forms/logoManagement'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import { SITE_CONFIG } from '@/types/cache-keys'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const LogoManagement = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      ...initialValues,
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      }
    }),
    [initialValues]
  )

  const form = useSettingsForm<SiteSettings>({
    schema: siteSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: SITE_CONFIG,
    refetch
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-8'>
      <Card>
        <CardContent>
          <DynamicForm form={form} fields={logoManagementFields} className='lg:grid-cols-3' />
        </CardContent>
      </Card>

      <FormSubmitButton
        size='lg'
        className='shadow-lg hover:shadow-xl w-full sm:w-auto min-w-48 transition-all duration-300'
        isSubmitting={form.formState.isSubmitting}
        isEditing={form.isEditing}
        savingLabel='Uploading...'
      />
    </form>
  )
}

export default LogoManagement
