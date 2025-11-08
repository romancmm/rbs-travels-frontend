'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { showError } from '@/lib/errMsg'
import { homepageFaqSchema, HomepageFaqType } from '@/lib/validations/schemas/faqSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: HomepageFaqType
  refetch?: () => void
}

const HomeFaqForm = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<HomepageFaqType>({
    resolver: zodResolver(homepageFaqSchema),
    defaultValues: {
      title: initialValues?.title || '',
      subTitle: initialValues?.subTitle || '',
      desc: initialValues?.desc || '',
      faqs: initialValues?.faqs || [{ question: '', answer: '' }]
    }
  })

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq
  } = useFieldArray({
    control,
    name: 'faqs'
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests.post(`/admin/settings/${settingsKey}`, {
        value: data
      })
      if (res?.success) {
        await revalidateTags(`/admin/settings/${settingsKey}`)
        toast.success('Settings updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>FAQ Section Settings</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Controller
            control={control}
            name='title'
            render={({ field }) => (
              <CustomInput
                label='Title'
                placeholder='Enter section title'
                error={errors.title?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          <Controller
            control={control}
            name='subTitle'
            render={({ field }) => (
              <CustomInput
                label='Sub Title'
                placeholder='Enter section sub title'
                error={errors.subTitle?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          <Controller
            control={control}
            name='desc'
            render={({ field }) => (
              <CustomInput
                label='Description'
                type='textarea'
                rows={4}
                placeholder='Short description...'
                error={errors.desc?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Items</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {faqFields.map((faqField, faqIndex) => (
            <div key={faqField.id} className='space-y-4 p-4 border border-dashed rounded-lg'>
              <div className='flex justify-between items-center'>
                <Label className='font-medium text-sm'>FAQ #{faqIndex + 1}</Label>
                <div className='flex gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => removeFaq(faqIndex)}
                    disabled={faqFields.length === 1}
                  >
                    <Minus className='w-4 h-4' />
                  </Button>
                  {faqIndex === faqFields.length - 1 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => appendFaq({ question: '', answer: '' })}
                      disabled={faqFields.length >= 20}
                    >
                      <Plus className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </div>

              <Controller
                control={control}
                name={`faqs.${faqIndex}.question`}
                render={({ field }) => (
                  <CustomInput
                    label='Question'
                    placeholder='Enter FAQ question'
                    error={errors?.faqs?.[faqIndex]?.question?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />

              <Controller
                control={control}
                name={`faqs.${faqIndex}.answer`}
                render={({ field }) => (
                  <CustomInput
                    label='Answer'
                    type='textarea'
                    rows={3}
                    placeholder='Enter FAQ answer'
                    error={errors?.faqs?.[faqIndex]?.answer?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type='submit' disabled={isSubmitting} size={'lg'}>
        {isSubmitting ? 'Saving...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>
    </form>
  )
}

export default HomeFaqForm
