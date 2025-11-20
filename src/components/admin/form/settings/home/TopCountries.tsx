'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
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

const TopCountriesSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      ...initialValues,
      topCountries: {
        title: initialValues?.topCountries?.title || '',
        subtitle: initialValues?.topCountries?.subtitle || '',
        destinations: initialValues?.topCountries?.destinations || []
      }
    }
  })

  const {
    fields: destinationsFields,
    append: appendDestination,
    remove: removeDestination
  } = useFieldArray({
    control,
    name: 'topCountries.destinations'
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
              name='topCountries.title'
              render={({ field }) => (
                <CustomInput
                  label='Title'
                  placeholder='Enter top countries title'
                  error={errors.topCountries?.title?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='topCountries.subtitle'
              render={({ field }) => (
                <CustomInput
                  label='Subtitle'
                  placeholder='Enter top countries subtitle'
                  error={errors.topCountries?.subtitle?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            {/* Destinations Section */}
            <div className='space-y-2 lg:col-span-2'>
              <label className='font-semibold text-lg'>Destinations</label>

              {destinationsFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No destinations added yet. Click &quot;Add Destination&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {destinationsFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardHeader>
                        <CardTitle className='flex justify-between items-center mb-4'>
                          <span>Destination {index + 1}</span>
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => removeDestination(index)}
                            className='hover:bg-red-50 hover:text-red-700'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
                          <Controller
                            control={control}
                            name={`topCountries.destinations.${index}.name`}
                            render={({ field }) => (
                              <CustomInput
                                label='Country Name'
                                placeholder='e.g., Dubai'
                                error={errors.topCountries?.destinations?.[index]?.name?.message}
                                {...field}
                                value={field.value ?? ''}
                              />
                            )}
                          />



                          <Controller
                            control={control}
                            name={`topCountries.destinations.${index}.visaType`}
                            render={({ field }) => (
                              <CustomInput
                                label='Visa Type'
                                placeholder='e.g., Work Visa, Student Visa'
                                error={errors.topCountries?.destinations?.[index]?.visaType?.message}
                                {...field}
                                value={field.value ?? ''}
                              />
                            )}
                          />

                          <div className='md:col-span-full'>
                            <Controller
                              control={control}
                              name={`topCountries.destinations.${index}.description`}
                              render={({ field }) => (
                                <CustomInput
                                  label='Description'
                                  type='textarea'
                                  rows={3}
                                  placeholder='Enter destination description'
                                  error={
                                    errors.topCountries?.destinations?.[index]?.description?.message
                                  }
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
                              name={`topCountries.destinations.${index}.image`}
                              render={({ field }) => (
                                <FileUploader
                                  value={field.value || ''}
                                  onChangeAction={field.onChange}
                                />
                              )}
                            />
                            {errors.topCountries?.destinations?.[index]?.image && (
                              <span className='text-red-500 text-xs'>
                                {errors.topCountries.destinations[index]?.image?.message}
                              </span>
                            )}
                          </div>

                          {/* <div className='md:col-span-2'>
                            <Controller
                              control={control}
                              name={`topCountries.destinations.${index}.topSectors`}
                              render={({ field }) => (
                                <CustomInput
                                  label='Top Sectors (comma separated)'
                                  placeholder='e.g., Healthcare, IT, Construction'
                                  error={
                                    errors.topCountries?.destinations?.[index]?.topSectors?.message
                                  }
                                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                  onChange={(e) => {
                                    const sectors = e.target.value
                                      .split(',')
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                    field.onChange(sectors)
                                  }}
                                />
                              )}
                            />
                          </div> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {destinationsFields.length < 10 && (
                <AddItemButton
                  onClick={() =>
                    appendDestination({
                      name: '',
                      image: '',
                      workers: '',
                      description: '',
                      topSectors: [],
                      averageSalary: '',
                      visaType: ''
                    })
                  }
                  label='Add Destination'
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

export default TopCountriesSection
