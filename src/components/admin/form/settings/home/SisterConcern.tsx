'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sisterConcernFields } from '@/config/forms/sisterConcern'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import {
  SisterConcernSettings,
  sisterConcernSettingsSchema
} from '@/lib/validations/schemas/sisterConcernSettings'
import { Building } from 'lucide-react'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: SisterConcernSettings | undefined
  refetch?: () => void
}

const SisterConcern = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      title: initialValues?.title || '',
      subtitle: initialValues?.subtitle || '',
      description: initialValues?.description || '',
      companies: initialValues?.companies || []
    }),
    [initialValues]
  )

  const form = useSettingsForm<SisterConcernSettings>({
    schema: sisterConcernSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: `/settings/${settingsKey}`,
    refetch,
    successMessage: 'Sister concern updated successfully!'
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-6'>
      <Card className='border-l-4 border-l-primary'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Building className='w-5 h-5' />
            Sister Concerns
          </CardTitle>
          <CardDescription>
            Configure the sister concern section and manage listed companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={sisterConcernFields} />
        </CardContent>
      </Card>

      <div className='flex justify-end gap-3'>
        <FormSubmitButton
          isSubmitting={form.formState.isSubmitting}
          isEditing={form.isEditing}
          size='lg'
        >
          Save Changes
        </FormSubmitButton>
      </div>
    </form>
  )
}

export default SisterConcern
