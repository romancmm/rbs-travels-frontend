'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import CustomInput from '@/components/common/CustomInput'
import FilePicker from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import {
  type HomepageSettings,
  homepageSettingsSchema
} from '@/lib/validations/schemas/homepageSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: HomepageSettings | undefined
  refetch?: () => void
}

const HomeServicesSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      ...initialValues,
      services: {
        title: initialValues?.services?.title || '',
        subtitle: initialValues?.services?.subtitle || '',
        services: initialValues?.services?.services || []
      }
    }
  })

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService
  } = useFieldArray({
    control,
    name: 'services.services'
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
        await revalidateTags(SITE_CONFIG)
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
        <CardContent>
          <div className='space-y-4'>
            <Controller
              control={control}
              name='services.title'
              render={({ field }) => (
                <CustomInput
                  label='Title'
                  placeholder='Enter services title'
                  error={errors.services?.title?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='services.subtitle'
              render={({ field }) => (
                <CustomInput
                  label='Subtitle'
                  placeholder='Enter services subtitle'
                  error={errors.services?.subtitle?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            {/* Services Section */}
            <div className='space-y-2 lg:col-span-2'>
              <label className='font-semibold text-lg'>Services</label>

              {serviceFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No services added yet. Click &quot;Add Service&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {serviceFields.map((field, index) => (
                    <Card key={field.id} className='hover:shadow-lg'>
                      <CardHeader className='flex justify-between items-center border-b'>
                        <CardTitle className='flex justify-between items-center'>
                          Service {index + 1}
                        </CardTitle>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeService(index)}
                          className='hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                          <Controller
                            control={control}
                            name={`services.services.${index}.name`}
                            render={({ field }) => (
                              <CustomInput
                                label='Service Name'
                                placeholder='e.g., Work Permit Processing'
                                error={errors.services?.services?.[index]?.name?.message}
                                {...field}
                                value={field.value ?? ''}
                              />
                            )}
                          />

                          <Controller
                            control={control}
                            name={`services.services.${index}.url`}
                            render={({ field }) => (
                              <CustomInput
                                label='URL'
                                placeholder='e.g., https://example.com/services/work-permit'
                                error={errors.services?.services?.[index]?.url?.message}
                                {...field}
                                value={field.value ?? ''}
                              />
                            )}
                          />

                          <div className='md:col-span-full'>
                            <Controller
                              control={control}
                              name={`services.services.${index}.description`}
                              render={({ field }) => (
                                <CustomInput
                                  label='Description'
                                  type='textarea'
                                  rows={3}
                                  placeholder='Enter service description'
                                  error={errors.services?.services?.[index]?.description?.message}
                                  {...field}
                                  value={field.value ?? ''}
                                />
                              )}
                            />
                          </div>

                          <div className='md:col-span-2'>
                            <label className='font-medium text-sm'>Image</label>
                            <Controller
                              control={control}
                              name={`services.services.${index}.image`}
                              render={({ field }) => (
                                <FilePicker
                                  value={field.value || ''}
                                  onChangeAction={field.onChange}
                                />
                              )}
                            />
                            {errors.services?.services?.[index]?.image && (
                              <span className='text-red-500 text-xs'>
                                {errors.services.services[index]?.image?.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {serviceFields.length < 10 && (
                <AddItemButton
                  onClick={() =>
                    appendService({
                      name: '',
                      image: '',
                      description: '',
                      url: ''
                    })
                  }
                  label='Add Service'
                  className='mt-4'
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type='submit' size={'lg'} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>
    </form>
  )
}

export default HomeServicesSection
