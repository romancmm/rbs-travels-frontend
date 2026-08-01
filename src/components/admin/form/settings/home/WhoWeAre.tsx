'use client'

import { AddItemButton } from '@/components/admin/common/AddItemButton'
import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import IconPickerModal from '@/components/admin/common/IconPickerModal'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import CustomInput from '@/components/common/CustomInput'
import FilePicker from '@/components/common/FilePicker'
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
import { whoWeAreFields } from '@/config/forms/whoWeAre'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import {
  type HomepageSettings,
  homepageSettingsSchema
} from '@/lib/validations/schemas/homepageSettings'
import { HOME_CONFIG } from '@/types/cache-keys'
import { Image as ImageIcon, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: HomepageSettings | undefined
  refetch?: () => void
}

const WhoWeAreSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      ...initialValues,
      whoWeAre: {
        title: initialValues?.whoWeAre?.title || '',
        subTitle: initialValues?.whoWeAre?.subTitle || '',
        desc: initialValues?.whoWeAre?.desc || '',
        iconType: initialValues?.whoWeAre?.iconType || 'icon',
        features: initialValues?.whoWeAre?.features || []
      }
    }),
    [initialValues]
  )

  const form = useSettingsForm<HomepageSettings>({
    schema: homepageSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: HOME_CONFIG,
    refetch
  })
  const {
    control,
    setValue,
    onSubmit,
    isEditing,
    formState: { errors, isSubmitting }
  } = form

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


  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card>
        <CardContent>
          <div className='space-y-4'>
            <DynamicForm form={form} fields={whoWeAreFields} />

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
                                <FilePicker
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

      <FormSubmitButton
        size='lg'
        isSubmitting={isSubmitting}
        isEditing={isEditing}
        savingLabel='Submitting...'
      />

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
