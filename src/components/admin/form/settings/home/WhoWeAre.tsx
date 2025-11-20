'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import IconPickerModal from '@/components/admin/common/IconPickerModal'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

const WhoWeAreSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      ...initialValues,
      whoWeAre: {
        title: initialValues?.whoWeAre?.title || '',
        subTitle: initialValues?.whoWeAre?.subTitle || '',
        desc: initialValues?.whoWeAre?.desc || '',
        features: initialValues?.whoWeAre?.features || []
      }
    }
  })

  const {
    fields: featuresFields,
    append: appendFeature,
    remove: removeFeature
  } = useFieldArray({
    control,
    name: 'whoWeAre.features'
  })

  console.log('initialValues :>> ', initialValues)

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
              name='whoWeAre.title'
              render={({ field }) => (
                <CustomInput
                  label='Title'
                  placeholder='Enter who we are title'
                  error={errors.whoWeAre?.title?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='whoWeAre.subTitle'
              render={({ field }) => (
                <CustomInput
                  label='Sub Title'
                  placeholder='Enter who we are subtitle'
                  error={errors.whoWeAre?.subTitle?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='whoWeAre.desc'
              render={({ field }) => (
                <CustomInput
                  label='Description'
                  type='textarea'
                  rows={3}
                  placeholder='Enter who we are description'
                  error={errors.whoWeAre?.desc?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            {/* Features Section */}
            <div className='space-y-2 lg:col-span-2'>
              <label className='font-semibold text-lg'>Features</label>

              {featuresFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No features added yet. Click &quot;Add Feature&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {featuresFields.map((field, index) => (
                    <div key={field.id} className='p-4 border rounded-lg'>
                      <div className='flex justify-between items-center mb-4'>
                        <h4 className='font-medium text-sm'>Feature {index + 1}</h4>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeFeature(index)}
                          className='hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='gap-3 grid grid-cols-1'>
                        <Controller
                          control={control}
                          name={`whoWeAre.features.${index}.title`}
                          render={({ field }) => (
                            <CustomInput
                              label='Title'
                              placeholder='e.g., Worldwide Coverage'
                              error={errors.whoWeAre?.features?.[index]?.title?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`whoWeAre.features.${index}.desc`}
                          render={({ field }) => (
                            <CustomInput
                              label='Description'
                              type='textarea'
                              rows={2}
                              placeholder='Enter feature description'
                              error={errors.whoWeAre?.features?.[index]?.desc?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`whoWeAre.features.${index}.icon`}
                          render={({ field }) => (
                            <div className='space-y-2'>
                              <label className='font-medium text-sm'>Icon (optional)</label>
                              <IconPickerModal
                                value={field.value as string}
                                onChange={(val) => field.onChange(val)}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {featuresFields.length < 10 && (
                <AddItemButton
                  onClick={() => appendFeature({ title: '', desc: '', icon: '' })}
                  label='Add Feature'
                  className='mt-4'
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type='submit' size={'lg'}>
        {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>
    </form>
  )
}

export default WhoWeAreSection
