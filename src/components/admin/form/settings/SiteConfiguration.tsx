'use client'

import { FormSubmitButton } from '@/components/admin/common/FormSubmitButton'
import { DynamicForm } from '@/components/admin/common/dynamic-form'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  siteConfigurationAddressesFields,
  siteConfigurationBasicFields,
  siteConfigurationFooterFields,
  siteConfigurationSeoFields
} from '@/config/forms/siteConfiguration'
import { useSettingsForm } from '@/hooks/useSettingsForm'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import { SITE_CONFIG } from '@/types/cache-keys'
import { Plus, Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { Controller } from 'react-hook-form'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const SiteConfiguration = ({ settingsKey, initialValues, refetch }: TProps) => {
  const values = useMemo(
    () => ({
      ...initialValues,
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      hotline: initialValues?.hotline || '',
      address: initialValues?.address || '',
      addresses: initialValues?.addresses || [],
      website: initialValues?.website || '',
      shortDescription: initialValues?.shortDescription || '',
      workingHours: initialValues?.workingHours || '',
      promoText: initialValues?.promoText || [],
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      },
      seo: {
        metaName: initialValues?.seo?.metaName || '',
        metaTitle: initialValues?.seo?.metaTitle || '',
        metaDescription: initialValues?.seo?.metaDescription || '',
        siteAuthor: initialValues?.seo?.siteAuthor || '',
        ogImage: initialValues?.seo?.ogImage || '',
        canonicalUrl: initialValues?.seo?.canonicalUrl || '',
        metaKeywords: initialValues?.seo?.metaKeywords || []
      },
      footer: {
        copyright: initialValues?.footer?.copyright || '',
        credit: {
          companyName: initialValues?.footer?.credit?.companyName || '',
          url: initialValues?.footer?.credit?.url || '',
          showCredit: initialValues?.footer?.credit?.showCredit ?? true
        }
      },
      favicon: initialValues?.favicon || ''
    }),
    [initialValues]
  )

  const form = useSettingsForm<SiteSettings>({
    schema: siteSettingsSchema,
    settingsKey,
    values,
    isEditing: !!initialValues,
    cacheTag: SITE_CONFIG,
    refetch
  })
  const {
    control,
    onSubmit,
    isEditing,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = form

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={siteConfigurationBasicFields} />
        </CardContent>
      </Card>

      {/* Promo Text - array of plain strings, doesn't fit the object-array field config */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Promotional Text</CardTitle>
            {(watch('promoText')?.length || 0) < 5 && (
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  const current = watch('promoText') || []
                  setValue('promoText', [...current, ''])
                }}
              >
                <Plus className='mr-2 w-4 h-4' />
                Add Promo Text
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name='promoText'
            render={({ field }) => {
              const promoTexts = field.value || []

              return promoTexts.length > 0 ? (
                <div className='space-y-4'>
                  {promoTexts.map((text, index) => (
                    <div key={index} className='flex items-start gap-2'>
                      <div className='flex-1'>
                        <CustomInput
                          placeholder='Enter promotional text'
                          maxLength={80}
                          showCharCount
                          value={text || ''}
                          onChange={(e) => {
                            const newPromoTexts = [...promoTexts]
                            newPromoTexts[index] = e.target.value
                            field.onChange(newPromoTexts)
                          }}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        onClick={() => {
                          const newPromoTexts = promoTexts.filter((_, i) => i !== index)
                          field.onChange(newPromoTexts)
                        }}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-gray-500 text-center'>
                  <p>
                    No promotional text added yet. Click &quot;Add Promo Text&quot; to create one.
                  </p>
                </div>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Multiple Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={siteConfigurationAddressesFields} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicForm form={form} fields={siteConfigurationFooterFields} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <DynamicForm form={form} fields={siteConfigurationSeoFields} />

          {/* Meta Keywords - array of plain strings, doesn't fit the object-array field config */}
          <Controller
            control={control}
            name='seo.metaKeywords'
            render={({ field }) => {
              const keywords = Array.isArray(field.value) ? field.value : []

              return (
                <div className='space-y-3'>
                  <div>
                    <label className='block mb-2 font-medium text-sm'>Meta Keywords</label>
                    <div className='flex gap-2'>
                      <CustomInput
                        placeholder='Enter keyword and press Enter'
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const input = e.currentTarget
                            const value = input.value.trim()

                            if (value && !keywords.includes(value)) {
                              field.onChange([...keywords, value])
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling?.querySelector('input')
                          const value = input?.value.trim()

                          if (value && !keywords.includes(value)) {
                            field.onChange([...keywords, value])
                            if (input) input.value = ''
                          }
                        }}
                      >
                        <Plus className='w-4 h-4' />
                      </Button>
                    </div>
                    <p className='mt-1 text-muted-foreground text-xs'>
                      Press Enter or click + to add keywords
                    </p>
                  </div>

                  {keywords.length > 0 && (
                    <div className='flex flex-wrap gap-2 bg-muted/50 p-3 rounded-lg'>
                      {keywords.map((keyword, index) => (
                        <div
                          key={index}
                          className='group flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full text-primary text-sm transition-colors'
                        >
                          <span>{keyword}</span>
                          <button
                            type='button'
                            onClick={() => {
                              field.onChange(keywords.filter((_, i) => i !== index))
                            }}
                            className='opacity-60 hover:opacity-100 transition-opacity'
                          >
                            <Trash2 className='w-3 h-3' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.seo?.metaKeywords?.message && (
                    <p className='text-destructive text-sm'>
                      {typeof errors.seo.metaKeywords.message === 'string'
                        ? errors.seo.metaKeywords.message
                        : ''}
                    </p>
                  )}
                </div>
              )
            }}
          />
        </CardContent>
      </Card>

      <FormSubmitButton isSubmitting={isSubmitting} isEditing={isEditing} savingLabel='Submitting...' />
    </form>
  )
}

export default SiteConfiguration
