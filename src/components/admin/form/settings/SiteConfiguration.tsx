'use client'

import { revalidateTags } from '@/action/data'
import CustomInput from '@/components/common/CustomInput'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const SiteConfiguration = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema) as any,
    defaultValues: {
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
      // seo: initialValues?.seo || {},
      footer: {
        copyright: initialValues?.footer?.copyright || '',
        credit: {
          companyName: initialValues?.footer?.credit?.companyName || '',
          url: initialValues?.footer?.credit?.url || '',
          showCredit: initialValues?.footer?.credit?.showCredit ?? true
        }
      },
      favicon: initialValues?.favicon || ''
    }
  })

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress
  } = useFieldArray({
    control,
    name: 'addresses'
  })


  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests[initialValues ? 'put' : 'post'](`/admin/setting/settings/${initialValues ? `key/${settingsKey}` : ''}`, {
        key: settingsKey,
        value: data
      })
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
      <Card title='Basic Information'>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            <Controller
              control={control}
              name='name'
              render={({ field }) => (
                <CustomInput
                  label='Site Name'
                  placeholder='Enter site name'
                  showCharCount
                  error={errors.name?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field }) => (
                <CustomInput
                  label='Email'
                  type='email'
                  placeholder='contact@example.com'
                  error={errors.email?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <CustomInput
                  label='Phone'
                  type='tel'
                  placeholder='+1 (555) 123-4567'
                  maxLength={20}
                  error={errors.phone?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='hotline'
              render={({ field }) => (
                <CustomInput
                  label='Hotline'
                  type='tel'
                  placeholder='+1 (555) 000-0000'
                  maxLength={20}
                  error={errors.hotline?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='website'
              render={({ field }) => (
                <CustomInput
                  label='Website'
                  type='url'
                  placeholder='https://example.com'
                  error={errors.website?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='workingHours'
              render={({ field }) => (
                <CustomInput
                  label='Working Hours'
                  placeholder='e.g., Mon-Fri: 9:00 AM - 6:00 PM'
                  showCharCount
                  error={errors.workingHours?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='address'
                render={({ field }) => (
                  <CustomInput
                    label='Address'
                    type='textarea'
                    rows={2}
                    placeholder='Enter full address'
                    maxLength={250}
                    showCharCount
                    error={errors.address?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='shortDescription'
                render={({ field }) => (
                  <CustomInput
                    label='Short Description'
                    type='textarea'
                    rows={3}
                    placeholder='Brief description of the site'
                    maxLength={500}
                    showCharCount
                    error={errors.shortDescription?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Text */}
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
                  <p>No promotional text added yet. Click &quot;Add Promo Text&quot; to create one.</p>
                </div>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Multiple Addresses */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Addresses</CardTitle>
            {addressFields.length < 2 && <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                appendAddress({
                  title: '',
                  address: '',
                  phone: '',
                  email: ''
                })
              }
            >
              <Plus className='mr-2 w-4 h-4' />
              Add Address
            </Button>}
          </div>
        </CardHeader>
        <CardContent>
          {addressFields.length > 0 ? (
            <div className='space-y-6'>
              {addressFields.map((field, index) => (
                <div key={field.id} className='relative bg-gray-50 p-4 border rounded-lg'>
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className='font-medium'>Address {index + 1}</h4>
                    <Button
                      type='button'
                      variant='destructive'
                      size='sm'
                      onClick={() => removeAddress(index)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                  <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
                    <div className='lg:col-span-2'>
                      <Controller
                        control={control}
                        name={`addresses.${index}.title`}
                        render={({ field }) => (
                          <CustomInput
                            label='Title'
                            placeholder='e.g., Head Office, Branch Office'
                            maxLength={35}
                            showCharCount
                            error={errors.addresses?.[index]?.title?.message}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />
                    </div>
                    <div className='lg:col-span-2'>
                      <Controller
                        control={control}
                        name={`addresses.${index}.address`}
                        render={({ field }) => (
                          <CustomInput
                            label='Address'
                            type='textarea'
                            rows={2}
                            placeholder='Enter full address'
                            maxLength={250}
                            showCharCount
                            error={errors.addresses?.[index]?.address?.message}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name={`addresses.${index}.phone`}
                      render={({ field }) => (
                        <CustomInput
                          label='Phone'
                          type='tel'
                          placeholder='+1 (555) 123-4567'
                          maxLength={20}
                          error={errors.addresses?.[index]?.phone?.message}
                          {...field}
                          value={field.value ?? ''}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`addresses.${index}.email`}
                      render={({ field }) => (
                        <CustomInput
                          label='Email'
                          type='email'
                          placeholder='contact@example.com'
                          error={errors.addresses?.[index]?.email?.message}
                          {...field}
                          value={field.value ?? ''}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-gray-500 text-center'>
              <p>No addresses added yet. Click &quot;Add Address&quot; to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card title='Footer'>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
            <div className='lg:col-span-2'>
              <Controller
                control={control}
                name='footer.copyright'
                render={({ field }) => (
                  <CustomInput
                    label='Copyright Text'
                    type='textarea'
                    placeholder='Enter copyright text'
                    maxLength={200}
                    showCharCount
                    error={errors.footer?.copyright?.message}
                    {...field}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>

            <Controller
              control={control}
              name='footer.credit.companyName'
              render={({ field }) => (
                <CustomInput
                  label='Developed by'
                  placeholder='Enter company name'
                  showCharCount
                  error={errors.footer?.credit?.companyName?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='footer.credit.url'
              render={({ field }) => (
                <CustomInput
                  label='Developed by URL'
                  type='url'
                  placeholder='https://example.com'
                  error={errors.footer?.credit?.url?.message}
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />
            <Controller
              control={control}
              name='footer.credit.showCredit'
              render={({ field }) => (
                <CustomInput
                  type='switch'
                  label={field.value ? `Show Credit` : `Hide Credit`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  error={errors.footer?.credit?.showCredit?.message}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* <Card title='SEO'>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>

        <CardContent>
          <div className='flex flex-col gap-4'>
            <Controller
              control={control}
              name='seo.metaTitle'
              render={({ field }) => (
                <CustomInput
                  label='Meta Title'
                  error={
                    typeof errors.seo?.metaTitle?.message === 'string'
                      ? errors.seo.metaTitle.message
                      : undefined
                  }
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='seo.metaDescription'
              render={({ field }) => (
                <CustomInput
                  label='Meta Description'
                  type='textarea'
                  rows={4}
                  placeholder='Meta description...'
                  maxLength={160}
                  showCharCount={true}
                  helperText='Max 160 characters allowed'
                  error={
                    typeof errors.seo?.metaDescription?.message === 'string'
                      ? errors.seo.metaDescription.message
                      : undefined
                  }
                  {...field}
                  value={field.value ?? ''}
                />
              )}
            />

            <Controller
              control={control}
              name='seo.metaKeywords'
              render={({ field }) => (
                <CustomInput
                  label='Meta Keywords'
                  type='textarea'
                  rows={3}
                  placeholder='Enter keywords separated by commas'
                  helperText='Separate keywords with commas'
                  error={
                    typeof errors.seo?.metaKeywords?.message === 'string'
                      ? errors.seo.metaKeywords.message
                      : undefined
                  }
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    const keywords = e.target.value
                      .split(',')
                      .map((k) => k.trim())
                      .filter(Boolean)
                    field.onChange(keywords)
                  }}
                />
              )}
            />
          </div>
        </CardContent>
      </Card> */}

      <Button type='submit'>
        {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>
    </form>
  )
}

export default SiteConfiguration
