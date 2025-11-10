'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { homepageFaqSchema, HomepageFaqType } from '@/lib/validations/schemas/faqSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleHelp, HelpCircle, MessageCircle, Plus, Trash2 } from 'lucide-react'
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
      const res = await requests[initialValues ? 'put' : 'post'](
        `/admin/setting/settings${initialValues ? `/key/${settingsKey}` : ''}`,
        {
          key: settingsKey,
          value: data
        }
      )
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
      {/* Section Info Card */}
      <Card className='border-l-4 border-l-primary'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MessageCircle className='w-5 h-5 text-primary' />
            Section Information
          </CardTitle>
          <CardDescription>Configure the FAQ section title, subtitle, and description</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Controller
            control={control}
            name='title'
            render={({ field }) => (
              <CustomInput
                label='Title'
                placeholder='e.g., Frequently Asked Questions'
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
                label='Subtitle'
                placeholder='e.g., Got Questions? We Have Answers'
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
                rows={3}
                placeholder='Brief description about the FAQ section...'
                error={errors.desc?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* FAQ Items Card */}
      <Card className='border-l-4 border-l-accent'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <HelpCircle className='w-5 h-5 text-accent' />
                FAQ Items
              </CardTitle>
              <CardDescription>
                Add and manage frequently asked questions
                {faqFields.length > 0 && (
                  <span className='ml-2 font-medium text-primary'>
                    ({faqFields.length} {faqFields.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </CardDescription>
            </div>
            <Button
              type='button'
              variant='default'
              size='sm'
              onClick={() => appendFaq({ question: '', answer: '' })}
              disabled={faqFields.length >= 20}
              className='flex items-center gap-2 shrink-0'
            >
              <Plus className='w-4 h-4' />
              Add FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faqFields.length === 0 ? (
            <div className='flex flex-col justify-center items-center gap-4 bg-muted/30 p-12 border-2 border-dashed rounded-xl text-center'>
              <div className='flex justify-center items-center bg-primary/10 rounded-full w-16 h-16'>
                <CircleHelp className='w-8 h-8 text-primary' />
              </div>
              <div className='space-y-2'>
                <p className='font-semibold text-lg'>No FAQs yet</p>
                <p className='text-muted-foreground text-sm'>
                  Get started by adding your first frequently asked question
                </p>
              </div>
              <Button
                type='button'
                variant='default'
                onClick={() => appendFaq({ question: '', answer: '' })}
                className='flex items-center gap-2 mt-2'
              >
                <Plus className='w-4 h-4' />
                Add Your First FAQ
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {faqFields.map((faqField, faqIndex) => (
                <Card
                  key={faqField.id}
                  className='relative border-2 hover:border-primary/50 overflow-hidden transition-all duration-200'
                >
                  {/* Gradient accent */}
                  <div className='top-0 absolute inset-x-0 bg-linear-to-r from-accent/10 via-primary/10 to-transparent h-1' />

                  <CardContent className='pt-6'>
                    <div className='flex justify-between items-start gap-4 mb-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex justify-center items-center bg-accent/10 border rounded-lg w-10 h-10'>
                          <span className='font-bold text-primary'>#{faqIndex + 1}</span>
                        </div>
                        <div>
                          <h4 className='font-semibold text-base'>FAQ Item {faqIndex + 1}</h4>
                          <p className='text-muted-foreground text-xs'>
                            Question and answer pair
                          </p>
                        </div>
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeFaq(faqIndex)}
                        disabled={faqFields.length === 1}
                        className='hover:bg-red-50 disabled:opacity-50 hover:text-red-600 shrink-0'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>

                    <div className='space-y-4'>
                      <Controller
                        control={control}
                        name={`faqs.${faqIndex}.question`}
                        render={({ field }) => (
                          <CustomInput
                            label='Question'
                            placeholder='e.g., What services do you offer?'
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
                            rows={4}
                            placeholder='Provide a detailed answer to the question...'
                            error={errors?.faqs?.[faqIndex]?.answer?.message}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className='flex justify-end items-center gap-4 pt-4'>
        <Button type='submit' size='lg' disabled={isSubmitting} className='min-w-[200px]'>
          {isSubmitting ? (
            <>
              <span className='mr-2 border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin' />
              Saving...
            </>
          ) : (
            <>{initialValues ? 'Update Settings' : 'Save Settings'}</>
          )}
        </Button>
      </div>
    </form>
  )
}

export default HomeFaqForm
