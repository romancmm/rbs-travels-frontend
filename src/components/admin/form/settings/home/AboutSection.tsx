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

const AboutSection = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(homepageSettingsSchema),
    defaultValues: {
      ...initialValues,
      about: {
        title: initialValues?.about?.title || '',
        subTitle: initialValues?.about?.subTitle || '',
        desc: initialValues?.about?.desc || '',
        image: initialValues?.about?.image || '',
        experience: {
          years: initialValues?.about?.experience?.years || '',
          text: initialValues?.about?.experience?.text || ''
        },
        facilitiesIconType: initialValues?.about?.facilitiesIconType || 'icon',
        facilities: initialValues?.about?.facilities || [],
        statsIconType: initialValues?.about?.statsIconType || 'icon',
        stats: initialValues?.about?.stats || []
      }
    }
  })

  const {
    fields: facilitiesFields,
    append: appendFacility,
    remove: removeFacility
  } = useFieldArray({
    control,
    name: 'about.facilities'
  })

  const {
    fields: statisticsFields,
    append: appendStatistic,
    remove: removeStatistic
  } = useFieldArray({
    control,
    name: 'about.stats'
  })

  // Watch icon type changes
  const facilitiesIconType = useWatch({
    control,
    name: 'about.facilitiesIconType'
  })

  const statsIconType = useWatch({
    control,
    name: 'about.statsIconType'
  })

  const prevFacilitiesIconTypeRef = useRef(facilitiesIconType)
  const prevStatsIconTypeRef = useRef(statsIconType)
  const [showFacilitiesAlert, setShowFacilitiesAlert] = useState(false)
  const [showStatsAlert, setShowStatsAlert] = useState(false)
  const [pendingFacilitiesIconType, setPendingFacilitiesIconType] = useState<'icon' | 'image' | null>(null)
  const [pendingStatsIconType, setPendingStatsIconType] = useState<'icon' | 'image' | null>(null)

  // Handle facilities icon type change
  const handleFacilitiesIconTypeChange = (newType: 'icon' | 'image') => {
    if (newType === facilitiesIconType) return
    if (facilitiesFields.length > 0 && facilitiesFields.some((f) => f.icon)) {
      setPendingFacilitiesIconType(newType)
      setShowFacilitiesAlert(true)
    } else {
      setValue('about.facilitiesIconType', newType)
    }
  }

  const confirmFacilitiesIconTypeChange = () => {
    if (pendingFacilitiesIconType) {
      setValue('about.facilitiesIconType', pendingFacilitiesIconType)
      setPendingFacilitiesIconType(null)
    }
    setShowFacilitiesAlert(false)
  }

  // Handle stats icon type change
  const handleStatsIconTypeChange = (newType: 'icon' | 'image') => {
    if (newType === statsIconType) return
    if (statisticsFields.length > 0 && statisticsFields.some((f) => f.icon)) {
      setPendingStatsIconType(newType)
      setShowStatsAlert(true)
    } else {
      setValue('about.statsIconType', newType)
    }
  }

  const confirmStatsIconTypeChange = () => {
    if (pendingStatsIconType) {
      setValue('about.statsIconType', pendingStatsIconType)
      setPendingStatsIconType(null)
    }
    setShowStatsAlert(false)
  }

  // Reset facilities icons when type changes
  useEffect(() => {
    if (prevFacilitiesIconTypeRef.current !== facilitiesIconType && prevFacilitiesIconTypeRef.current !== undefined) {
      facilitiesFields.forEach((_, index) => {
        setValue(`about.facilities.${index}.icon`, '')
      })
      toast.info(`Facilities icon type changed to ${facilitiesIconType}. All icons have been reset.`)
    }
    prevFacilitiesIconTypeRef.current = facilitiesIconType
  }, [facilitiesIconType, facilitiesFields, setValue])

  // Reset stats icons when type changes
  useEffect(() => {
    if (prevStatsIconTypeRef.current !== statsIconType && prevStatsIconTypeRef.current !== undefined) {
      statisticsFields.forEach((_, index) => {
        setValue(`about.stats.${index}.icon`, '')
      })
      toast.info(`Stats icon type changed to ${statsIconType}. All icons have been reset.`)
    }
    prevStatsIconTypeRef.current = statsIconType
  }, [statsIconType, statisticsFields, setValue])

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
              name='about.title'
              render={({ field }) => (
                <CustomInput
                  label='Title'
                  placeholder='Enter about title'
                  error={errors.about?.title?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='about.subTitle'
              render={({ field }) => (
                <CustomInput
                  label='Sub Title'
                  placeholder='Enter about subtitle'
                  error={errors.about?.subTitle?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='about.desc'
              render={({ field }) => (
                <CustomInput
                  label='Description'
                  type='textarea'
                  rows={3}
                  placeholder='Enter about description'
                  error={errors.about?.desc?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            {/* Experience Section */}
            <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
              <Controller
                control={control}
                name='about.experience.years'
                render={({ field }) => (
                  <CustomInput
                    label='Experience Years'
                    placeholder='e.g., 25+'
                    error={errors.about?.experience?.years?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />

              <Controller
                control={control}
                name='about.experience.text'
                render={({ field }) => (
                  <CustomInput
                    label='Experience Text'
                    placeholder='e.g., Years of Excellence'
                    error={errors.about?.experience?.text?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <div className=''>
              <label className='font-medium text-sm'>Image</label>
              <Controller
                control={control}
                name='about.image'
                render={({ field }) => (
                  <FileUploader value={field.value || ''} onChangeAction={field.onChange} />
                )}
              />
              {errors.about?.image && (
                <span className='text-red-500 text-xs'>{errors.about.image.message}</span>
              )}
            </div>

            {/* Facilities Section */}
            <div className='space-y-2 lg:col-span-2'>
              <div className='flex justify-between items-center gap-4 w-full'>
                <label className='font-semibold text-lg'>Facilities</label>
                {/* Facilities Icon Type Selector */}
                <Controller
                  control={control}
                  name='about.facilitiesIconType'
                  render={({ field }) => (
                    <div className='inline-flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-lg'>
                      <Button
                        type='button'
                        variant={field.value === 'icon' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleFacilitiesIconTypeChange('icon')}
                        className='size-8!'
                      >
                        <Sparkles className='w-4 h-4' />
                      </Button>
                      <Button
                        type='button'
                        variant={field.value === 'image' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleFacilitiesIconTypeChange('image')}
                        className='size-8!'
                      >
                        <ImageIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                />
              </div>

              {facilitiesFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No facilities added yet. Click &quot;Add Facility&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {facilitiesFields.map((field, index) => (
                    <div key={field.id} className='hover:shadow-lg p-4 border rounded-lg'>
                      <div className='flex justify-between items-center mb-4'>
                        <h4 className='font-medium text-sm'>Facility {index + 1}</h4>
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={() => removeFacility(index)}
                          className='hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='gap-3 grid grid-cols-1'>
                        <Controller
                          control={control}
                          name={`about.facilities.${index}.title`}
                          render={({ field }) => (
                            <CustomInput
                              label='Title'
                              placeholder='e.g., Safety First Always'
                              error={errors.about?.facilities?.[index]?.title?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.facilities.${index}.desc`}
                          render={({ field }) => (
                            <CustomInput
                              label='Description'
                              type='textarea'
                              rows={2}
                              placeholder='Enter facility description'
                              error={errors.about?.facilities?.[index]?.desc?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.facilities.${index}.icon`}
                          render={({ field }) => (
                            <div className='space-y-1.5'>
                              <label className='block font-medium text-sm'>
                                {facilitiesIconType === 'image' ? 'Image' : 'Icon'} (optional)
                              </label>
                              {facilitiesIconType === 'image' ? (
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

              {facilitiesFields.length < 4 && <AddItemButton label="Add Facility" onClick={() => appendFacility({ title: '', desc: '', icon: '' })} />}
            </div>

            {/* <div className='space-y-2 lg:col-span-2'>
              <div className='flex justify-between items-center gap-4 w-full'>
                <label className='font-semibold text-lg'>Statistics</label>
                {/* Stats Icon Type Selector 
                <Controller
                  control={control}
                  name='about.statsIconType'
                  render={({ field }) => (
                    <div className='inline-flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-lg'>
                      <Button
                        type='button'
                        variant={field.value === 'icon' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleStatsIconTypeChange('icon')}
                        className='size-8!'
                      >
                        <Sparkles className='w-4 h-4' />
                      </Button>
                      <Button
                        type='button'
                        variant={field.value === 'image' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleStatsIconTypeChange('image')}
                        className='size-8!'
                      >
                        <ImageIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                />
              </div>

              {statisticsFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No statistics added yet. Click &quot;Add Statistic&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {statisticsFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex-1 space-y-3 hover:shadow-lg p-4 border rounded-lg'
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='font-medium text-sm'>Statistic {index + 1}</h4>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeStatistic(index)}
                          className='hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='space-y-3'>
                        <Controller
                          control={control}
                          name={`about.stats.${index}.value`}
                          render={({ field }) => (
                            <CustomInput
                              label='Value'
                              placeholder='e.g., 1.6k+, 50+'
                              error={errors.about?.stats?.[index]?.value?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.stats.${index}.label`}
                          render={({ field }) => (
                            <CustomInput
                              label='Label'
                              placeholder='e.g., Happy Travelers'
                              error={errors.about?.stats?.[index]?.label?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.stats.${index}.icon`}
                          render={({ field }) => (
                            <div className='space-y-1.5'>
                              <label className='block font-medium text-sm'>
                                {statsIconType === 'image' ? 'Image' : 'Icon'} (optional)
                              </label>
                              {statsIconType === 'image' ? (
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

              {facilitiesFields.length < 4 && <AddItemButton label="Add Facility" onClick={() => appendFacility({ title: '', desc: '', icon: '' })} />}
            </div> */}

            <div className='space-y-2 lg:col-span-2'>
              <div className='flex justify-between items-center gap-4 w-full'>
                <label className='font-semibold text-lg'>Statistics</label>
                {/* Stats Icon Type Selector */}
                <Controller
                  control={control}
                  name='about.statsIconType'
                  render={({ field }) => (
                    <div className='inline-flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-lg'>
                      <Button
                        type='button'
                        variant={field.value === 'icon' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleStatsIconTypeChange('icon')}
                        className='size-8!'
                      >
                        <Sparkles className='w-4 h-4' />
                      </Button>
                      <Button
                        type='button'
                        variant={field.value === 'image' ? 'default' : 'ghost'}
                        size='icon'
                        onClick={() => handleStatsIconTypeChange('image')}
                        className='size-8!'
                      >
                        <ImageIcon className='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                />
              </div>

              {statisticsFields.length === 0 ? (
                <div className='p-4 border-2 border-dashed rounded-lg text-center'>
                  No statistics added yet. Click &quot;Add Statistic&quot; to get started.
                </div>
              ) : (
                <div className='flex flex-wrap *:flex-[1_1_calc(50%-16px)] gap-4'>
                  {statisticsFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex-1 space-y-3 p-4 border rounded-lg min-w-full sm:min-w-[45%] lg:min-w-[30%]'
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='font-medium text-sm'>Statistic {index + 1}</h4>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeStatistic(index)}
                          className='hover:bg-red-50 hover:text-red-700'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='space-y-3'>
                        <Controller
                          control={control}
                          name={`about.stats.${index}.value`}
                          render={({ field }) => (
                            <CustomInput
                              label='Value'
                              placeholder='e.g., 1.6k+, 50+'
                              error={errors.about?.stats?.[index]?.value?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.stats.${index}.label`}
                          render={({ field }) => (
                            <CustomInput
                              label='Label'
                              placeholder='e.g., Happy Travelers'
                              error={errors.about?.stats?.[index]?.label?.message}
                              {...field}
                              value={field.value ?? ''}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`about.stats.${index}.icon`}
                          render={({ field }) => (
                            <div className='space-y-2'>
                              <label className='font-medium text-sm'>
                                {statsIconType === 'image' ? 'Image' : 'Icon'} (optional)
                              </label>
                              {statsIconType === 'image' ? (
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

              {statisticsFields.length < 4 && <AddItemButton label="Add Statistic" onClick={() => appendStatistic({ value: '', label: '', icon: '' })} />}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type='submit' size={'lg'}>
        {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>

      {/* Facilities Icon Type Change Alert Dialog */}
      <AlertDialog open={showFacilitiesAlert} onOpenChange={setShowFacilitiesAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Facilities Icon Type?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the icon type will reset all existing icons in your facilities. This action
              cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingFacilitiesIconType(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmFacilitiesIconTypeChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats Icon Type Change Alert Dialog */}
      <AlertDialog open={showStatsAlert} onOpenChange={setShowStatsAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Statistics Icon Type?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the icon type will reset all existing icons in your statistics. This action
              cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatsIconType(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatsIconTypeChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

export default AboutSection
