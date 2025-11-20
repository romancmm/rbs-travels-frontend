'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import IconPickerModal from '@/components/admin/common/IconPickerModal'
import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
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
import { Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
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
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      ...initialValues,
      whoWeAre: {
        title: initialValues?.whoWeAre?.title || '',
        subTitle: initialValues?.whoWeAre?.subTitle || '',
        desc: initialValues?.whoWeAre?.desc || '',
        iconType: initialValues?.whoWeAre?.iconType || 'icon',
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

  // Watch iconType changes
  const iconType = useWatch({
    control,
    name: 'whoWeAre.iconType'
  })

  const prevIconTypeRef = useRef(iconType)
  const [showAlert, setShowAlert] = useState(false)
  const [pendingIconType, setPendingIconType] = useState<'icon' | 'image' | null>(null)

  // Handle icon type change with confirmation
  const handleIconTypeChange = (newType: 'icon' | 'image') => {
    if (newType === iconType) return
    if (featuresFields.length > 0 && featuresFields.some((f) => f.icon)) {
      setPendingIconType(newType)
      setShowAlert(true)
    } else {
      setValue('whoWeAre.iconType', newType)
    }
  }

  const confirmIconTypeChange = () => {
    if (pendingIconType) {
      setValue('whoWeAre.iconType', pendingIconType)
      setPendingIconType(null)
    }
    setShowAlert(false)
  }

  // Reset all icon fields when iconType changes
  useEffect(() => {
    if (prevIconTypeRef.current !== iconType && prevIconTypeRef.current !== undefined) {
      // Reset all feature icons when type changes
      featuresFields.forEach((_, index) => {
        setValue(`whoWeAre.features.${index}.icon`, '')
      })
      toast.info(`Icon type changed to ${iconType}. All icons have been reset.`)
    }
    prevIconTypeRef.current = iconType
  }, [iconType, featuresFields, setValue])

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
              <div className='flex justify-between items-center gap-4 w-full'>
                <label className='font-semibold text-lg'>Features</label>
                {/* Icon Type Selector */}
                <Controller
                  control={control}
                  name='whoWeAre.iconType'
                  render={({ field }) => (
                    <div className='inline-flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-lg'>
                      <Button
                        type='button'
                        variant={field.value === 'icon' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleIconTypeChange('icon')}
                        className='size-8!'
                      >
                        <Sparkles className='w-4 h-4' />
                      </Button>
                      <Button
                        type='button'
                        variant={field.value === 'image' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleIconTypeChange('image')}
                        className='size-8!'
                      >
                        <ImageIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                />
              </div>

              {featuresFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No features added yet. Click &quot;Add Feature&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {featuresFields.map((field, index) => (
                    <div key={field.id} className='hover:shadow-lg p-4 border rounded-lg'>
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
                            <div className='space-y-1.5'>
                              <label className='block font-medium text-sm'>
                                {iconType === 'image' ? 'Image' : 'Icon'} (optional)
                              </label>
                              {iconType === 'image' ? (
                                <FileUploader
                                  value={field.value as string}
                                  onChangeAction={(val: string | string[]) => field.onChange(val)}
                                  size='small'
                                />
                              ) : (
                                <IconPickerModal
                                  value={field.value as string}
                                  onChange={(val) => field.onChange(val)}
                                />
                              )}
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

      {/* Icon Type Change Alert Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Icon Type?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the icon type will reset all existing icons in your features. This action
              cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingIconType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmIconTypeChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

export default WhoWeAreSection
