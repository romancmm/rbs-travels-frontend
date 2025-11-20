'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import {
  TestimonialSettings,
  testimonialSettingsSchema
} from '@/lib/validations/schemas/testimonialSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquareQuote, Plus, Star, Trash2, User } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: TestimonialSettings | undefined
  refetch?: () => void
}

const HomeTestimonial = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(testimonialSettingsSchema),
    defaultValues: {
      title: initialValues?.title || '',
      subtitle: initialValues?.subtitle || '',
      testimonials: initialValues?.testimonials || []
    }
  })

  const {
    fields: testimonialsFields,
    append: appendTestimonial,
    remove: removeTestimonial
  } = useFieldArray({
    control,
    name: 'testimonials'
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
        await revalidateTags(settingsKey)
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
            <MessageSquareQuote className='w-5 h-5' />
            Section Information
          </CardTitle>
          <CardDescription>Configure the testimonials section title and subtitle</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Controller
            control={control}
            name='title'
            render={({ field }) => (
              <CustomInput
                label='Title'
                placeholder='e.g., What Our Clients Say'
                error={errors.title?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          <Controller
            control={control}
            name='subtitle'
            render={({ field }) => (
              <CustomInput
                label='Subtitle'
                placeholder='e.g., Client Testimonials'
                error={errors.subtitle?.message}
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
                placeholder='e.g., Hear from our satisfied customers about their experiences.'
                error={errors.desc?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Testimonials List Card */}
      <Card className='border-l-4 border-l-accent'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='w-5 h-5' />
            Customer Testimonials
          </CardTitle>
          <CardDescription>
            Add and manage customer reviews and testimonials
            {testimonialsFields.length > 0 && (
              <span className='ml-2 font-medium text-primary'>
                ({testimonialsFields.length} {testimonialsFields.length === 1 ? 'testimonial' : 'testimonials'})
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testimonialsFields.length === 0 ? (
            <div className='flex flex-col justify-center items-center gap-4 bg-muted/30 p-12 border-2 border-dashed rounded-xl text-center'>
              <div className='flex justify-center items-center bg-primary/10 rounded-full w-16 h-16'>
                <MessageSquareQuote className='w-8 h-8 text-primary' />
              </div>
              <div className='space-y-2'>
                <p className='font-semibold text-lg'>No testimonials yet</p>
                <p className='text-muted-foreground text-sm'>
                  Get started by adding your first customer testimonial
                </p>
              </div>
              <Button
                type='button'
                variant='default'
                onClick={() =>
                  appendTestimonial({
                    name: '',
                    avatar: '',
                    rating: 5,
                    review: '',
                    designation: ''
                  })
                }
                className='flex items-center gap-2 mt-2'
              >
                <Plus className='w-4 h-4' />
                Add Your First Testimonial
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {testimonialsFields.map((field, index) => (
                <Card
                  key={field.id}
                  className='hover:shadow-lg overflow-hidden transition-all duration-200'
                >
                  <CardHeader className='flex justify-between items-center border-b'>
                    <CardTitle className='flex flex-col'>
                      <h4 className='font-semibold text-base'>Testimonial {index + 1}</h4>
                      <p className='font-medium text-muted-foreground text-xs'>
                        Customer review and rating
                      </p>
                    </CardTitle>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => removeTestimonial(index)}
                      className='hover:bg-red-50 hover:text-red-600 shrink-0'
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                      {/* Name */}
                      <Controller
                        control={control}
                        name={`testimonials.${index}.name`}
                        render={({ field }) => (
                          <CustomInput
                            label='Customer Name'
                            placeholder='e.g., John Doe'
                            error={errors.testimonials?.[index]?.name?.message}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />

                      {/* Designation */}
                      <Controller
                        control={control}
                        name={`testimonials.${index}.designation`}
                        render={({ field }) => (
                          <CustomInput
                            label='Designation / Role'
                            placeholder='e.g., Marketing Manager'
                            error={errors.testimonials?.[index]?.designation?.message}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />

                      {/* Review */}
                      <div className='md:col-span-2'>
                        <Controller
                          control={control}
                          name={`testimonials.${index}.review`}
                          render={({ field }) => (
                            <CustomInput
                              label='Review / Testimonial'
                              type='textarea'
                              rows={4}
                              placeholder='Share what the customer said about your service...'
                              error={errors.testimonials?.[index]?.review?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />
                      </div>

                      {/* Rating */}
                      <Controller
                        control={control}
                        name={`testimonials.${index}.rating`}
                        render={({ field }) => (
                          <div className='space-y-2'>
                            <CustomInput
                              label='Rating'
                              type='number'
                              placeholder='5'
                              min={1}
                              max={5}
                              step={0.5}
                              error={errors.testimonials?.[index]?.rating?.message}
                              {...field}
                              value={field.value ?? 5}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value)
                                if (isNaN(value)) return
                                const clampedValue = Math.min(Math.max(value, 1), 5)
                                field.onChange(clampedValue)
                              }}
                            />
                            <div className='flex items-center gap-1'>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < (field.value || 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                                />
                              ))}
                              <span className='ml-2 text-muted-foreground text-sm'>
                                {field.value || 0} / 5
                              </span>
                            </div>
                          </div>
                        )}
                      />

                      {/* Avatar Upload */}
                      <div className='space-y-2'>
                        <label className='font-medium text-sm'>Customer Avatar</label>
                        <Controller
                          control={control}
                          name={`testimonials.${index}.avatar`}
                          render={({ field }) => (
                            <FileUploader
                              value={field.value || ''}
                              onChangeAction={field.onChange}
                              size='small'
                            />
                          )}
                        />
                        {errors.testimonials?.[index]?.avatar && (
                          <span className='text-red-500 text-xs'>
                            {errors.testimonials[index]?.avatar?.message}
                          </span>
                        )}
                        <p className='text-muted-foreground text-xs'>
                          Optional: Upload customer photo or avatar
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {testimonialsFields.length < 10 &&
                <AddItemButton
                  onClick={() => appendTestimonial({
                    name: '',
                    avatar: '',
                    rating: 5,
                    review: '',
                    designation: ''
                  })} />
              }
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

export default HomeTestimonial
