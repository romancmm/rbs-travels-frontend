'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { homeFaqFields } from '@/config/forms/homeFaq'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { homepageFaqSchema, HomepageFaqType } from '@/lib/validations/schemas/faqSettings'
import { MessageCircle } from 'lucide-react'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: HomepageFaqType
  refetch?: () => void
}

const HomeFaqForm = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      title: initialValues?.title || '',
      subTitle: initialValues?.subTitle || '',
      desc: initialValues?.desc || '',
      faqs: initialValues?.faqs || [{ question: '', answer: '' }]
    }),
    [initialValues]
  )

  const form = useSettingsForm<HomepageFaqType>({
    schema: homepageFaqSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: `/settings/${settingsKey}`,
    refetch
  })

  return (
    <form onSubmit={form.onSubmit} className='space-y-6'>
      <Card className='border-l-4 border-l-primary'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageCircle className='w-5 h-5' />
            FAQ Settings
          </CardTitle>
          <CardDescription>
            Configure the FAQ section title, subtitle, description, and questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={homeFaqFields} />
        </CardContent>
      </Card>

      <div className='flex justify-end items-center gap-4 pt-4'>
        <FormSubmitButton
          size='lg'
          className='min-w-50'
          isSubmitting={form.formState.isSubmitting}
          isEditing={form.isEditing}
        />
      </div>
    </form>
  )
}

export default HomeFaqForm
