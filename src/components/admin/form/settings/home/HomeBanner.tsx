'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import {
  type HomepageSettings,
  bannerSectionSchema
} from '@/lib/validations/schemas/homepageSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// Wrapper schema for the form (wraps array in object for react-hook-form)
const formSchema = z.object({
  banners: bannerSectionSchema
})

type TProps = {
  settingsKey: string
  initialValues?: HomepageSettings | undefined
  refetch?: () => void
}

const HomeBanner = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      banners: initialValues?.banners || [
        {
          title: '',
          subTitle: '',
          desc: '',
          bgImage: '',
          isActive: true,
          buttons: []
        }
      ]
    }
  })

  const {
    fields: bannerFields,
    append: appendBanner,
    remove: removeBanner
  } = useFieldArray({
    control,
    name: 'banners'
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests[initialValues ? 'put' : 'post'](
        `/admin/setting/settings${initialValues ? `/key/${settingsKey}` : ''}`,
        {
          key: settingsKey,
          value: { banners: data.banners }
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
      <div className='flex justify-between items-center mb-4'>
        <h2 className='font-semibold text-xl'>Hero Banners / Carousel</h2>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            appendBanner({
              title: '',
              subTitle: '',
              desc: '',
              bgImage: '',
              isActive: true,
              buttons: []
            })
          }
        >
          <Plus className='mr-2 w-4 h-4' />
          Add Banner
        </Button>
      </div>

      {bannerFields.map((banner, bannerIndex) => (
        <BannerCard
          key={banner.id}
          control={control}
          bannerIndex={bannerIndex}
          errors={errors.banners}
          removeBanner={removeBanner}
          canRemove={bannerFields.length > 1}
        />
      ))}

      <Button type='submit' size='lg' disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialValues ? 'Update Banners' : 'Save Banners'}
      </Button>
    </form>
  )
}

// Separate component to handle buttons fieldArray properly
function BannerCard({
  control,
  bannerIndex,
  errors,
  removeBanner,
  canRemove
}: {
  control: any
  bannerIndex: number
  errors: any
  removeBanner: (index: number) => void
  canRemove: boolean
}) {
  const {
    fields: buttonFields,
    append: appendButton,
    remove: removeButton
  } = useFieldArray({
    control,
    name: `banners.${bannerIndex}.buttons` as const
  })

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Banner {bannerIndex + 1}</CardTitle>

          <div className="flex items-center gap-3">
            {/* Active Status Switch */}
            <Controller
              control={control}
              name={`banners.${bannerIndex}.isActive`}
              render={({ field }) => (
                <CustomInput
                  type='switch'
                  // label={field.value ? 'Active' : 'Inactive'}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            {canRemove && (
              <Button
                type='button'
                variant='destructive'
                size='sm'
                onClick={() => removeBanner(bannerIndex)}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            )}
          </div>

        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Title */}
          <Controller
            control={control}
            name={`banners.${bannerIndex}.title`}
            render={({ field }) => (
              <CustomInput
                label='Title'
                placeholder='Enter banner title'
                error={errors?.[bannerIndex]?.title?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          {/* Subtitle */}
          <Controller
            control={control}
            name={`banners.${bannerIndex}.subTitle`}
            render={({ field }) => (
              <CustomInput
                label='Subtitle'
                placeholder='Enter banner subtitle'
                error={errors?.[bannerIndex]?.subTitle?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name={`banners.${bannerIndex}.desc`}
            render={({ field }) => (
              <CustomInput
                label='Description'
                type='textarea'
                rows={3}
                placeholder='Enter banner description'
                error={errors?.[bannerIndex]?.desc?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />



          {/* Background Image */}
          <Controller
            control={control}
            name={`banners.${bannerIndex}.bgImage`}
            render={({ field }) => (
              <div className='space-y-2'>
                <label className='font-medium text-sm'>Banner Image</label>
                <FileUploader
                  value={field.value || ''}
                  onChangeAction={field.onChange}
                  multiple={false}
                  maxAllow={1}
                  size='large'
                />
                {errors?.[bannerIndex]?.bgImage && (
                  <span className='font-medium text-red-500 text-xs'>
                    {errors[bannerIndex]?.bgImage?.message}
                  </span>
                )}
              </div>
            )}
          />

          {/* Buttons */}
          <div className='space-y-4 bg-linear-to-br from-blue-50 via-white to-purple-50 p-5 border-2 border-blue-200 border-dashed rounded-lg'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <div className='flex justify-center items-center bg-blue-100 rounded-lg w-8 h-8'>
                  <Plus className='w-4 h-4 text-blue-600' />
                </div>
                <div>
                  <label className='font-semibold text-gray-900 text-sm'>
                    Call-to-Action Buttons
                  </label>
                  <p className='text-gray-500 text-xs'>
                    Add up to 2 buttons for banner actions
                  </p>
                </div>
              </div>
              {buttonFields?.length < 2 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  className='hover:bg-blue-50 border-blue-300 hover:border-blue-400'
                  onClick={() => appendButton({ title: '', url: '' })}
                >
                  <Plus className='mr-1.5 w-3.5 h-3.5' />
                  Add Button
                </Button>
              )}
            </div>

            {buttonFields.length > 0 ? (
              <div className='space-y-3'>
                {buttonFields.map((button, buttonIndex) => (
                  <div
                    key={button.id}
                    className='relative bg-white shadow-sm hover:shadow-md p-4 border border-gray-200 rounded-lg transition-shadow'
                  >
                    <div className='flex items-center gap-3 w-full'>
                      <div className="flex flex-1 *:flex-1 gap-4">
                        <Controller
                          control={control}
                          name={`banners.${bannerIndex}.buttons.${buttonIndex}.title`}
                          render={({ field }) => (
                            <CustomInput
                              label='Button Text'
                              placeholder='e.g., Get Started, Learn More'
                              error={errors?.[bannerIndex]?.buttons?.[buttonIndex]?.title?.message}
                              {...field}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`banners.${bannerIndex}.buttons.${buttonIndex}.url`}
                          render={({ field }) => (
                            <CustomInput
                              label='Button URL'
                              placeholder='/contact or https://example.com'
                              error={errors?.[bannerIndex]?.buttons?.[buttonIndex]?.url?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='hover:bg-red-50 hover:text-red-600 shrink-0'
                        onClick={() => removeButton(buttonIndex)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col justify-center items-center bg-white/50 py-8 border border-gray-300 border-dashed rounded-lg text-center'>
                <div className='flex justify-center items-center bg-gray-100 mb-3 rounded-full w-12 h-12'>
                  <Plus className='w-6 h-6 text-gray-400' />
                </div>
                <p className='mb-1 font-medium text-gray-600 text-sm'>No buttons added yet</p>
                <p className='mb-3 text-gray-500 text-xs'>
                  Click &quot;Add Button&quot; above to create a call-to-action
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HomeBanner
