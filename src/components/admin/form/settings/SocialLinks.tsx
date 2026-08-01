'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { socialLinksFields } from '@/config/forms/socialLinks'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { SocialLinksSchema, SocialLinksType, SocialPlatform } from '@/lib/validations/schemas/socialLinks'
import { Globe } from 'lucide-react'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: SocialLinksType | undefined
  refetch?: () => void
}

const SocialLinksForm = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(() => {
    const result = {} as SocialLinksType
    Object.values(SocialPlatform).forEach((platform) => {
      result[platform] = {
        url: initialValues?.[platform]?.url || '',
        isActive: initialValues?.[platform]?.isActive ?? true,
        displayText: initialValues?.[platform]?.displayText || ''
      }
    })
    return result
  }, [initialValues])

  const form = useSettingsForm<SocialLinksType>({
    schema: SocialLinksSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: `/settings/${settingsKey}`,
    refetch,
    successMessage: 'Social links updated successfully!'
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Globe className='w-5 h-5' />
            Social Media Management
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Configure your social media presence. Only active links with URLs will be displayed.
          </p>
        </CardHeader>

        <CardContent className='space-y-4'>
          <DynamicForm form={form} fields={socialLinksFields} />

          <div className='flex justify-end'>
            <FormSubmitButton
              isSubmitting={form.formState.isSubmitting}
              isEditing={form.isEditing}
              savingLabel='Updating...'
            >
              Update Social Links
            </FormSubmitButton>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export default SocialLinksForm
