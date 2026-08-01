'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { homeTestimonialFields } from '@/config/forms/homeTestimonial'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import {
  TestimonialSettings,
  testimonialSettingsSchema
} from '@/lib/validations/schemas/testimonialSettings'
import { MessageSquareQuote } from 'lucide-react'
import { useMemo } from 'react'

type TProps = {
  settingsKey: string
  initialValues?: TestimonialSettings | undefined
  refetch?: () => void
}

const HomeTestimonial = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      title: initialValues?.title || '',
      subtitle: initialValues?.subtitle || '',
      desc: initialValues?.desc || '',
      testimonials: initialValues?.testimonials || []
    }),
    [initialValues]
  )

  const form = useSettingsForm<TestimonialSettings>({
    schema: testimonialSettingsSchema,
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
            <MessageSquareQuote className='w-5 h-5' />
            Testimonials
          </CardTitle>
          <CardDescription>
            Configure the testimonials section and manage customer reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={homeTestimonialFields} />
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

export default HomeTestimonial
