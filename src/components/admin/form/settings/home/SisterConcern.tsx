'use client'

import { revalidateTags } from '@/action/data'
import { AddItemButton } from '@/components/admin/common/AddItemButton'
import CustomInput from '@/components/common/CustomInput'
import FilePicker from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { showError } from '@/lib/errMsg'
import {
  SisterConcernSettings,
  sisterConcernSettingsSchema
} from '@/lib/validations/schemas/sisterConcernSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building, ExternalLink, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: SisterConcernSettings | undefined
  refetch?: () => void
}

const SisterConcern = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(sisterConcernSettingsSchema),
    defaultValues: {
      title: initialValues?.title || '',
      subtitle: initialValues?.subtitle || '',
      companies: initialValues?.companies || []
    }
  })

  const {
    fields: companiesFields,
    append: appendCompany,
    remove: removeCompany
  } = useFieldArray({
    control,
    name: 'companies'
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
        toast.success('Sister concern companies updated successfully!')
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
            <Building className='w-5 h-5' />
            Section Information
          </CardTitle>
          <CardDescription>Configure the sister concern section title and subtitle</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Controller
            control={control}
            name='title'
            render={({ field }) => (
              <CustomInput
                label='Title'
                placeholder='e.g., Our Sister Concerns'
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
                placeholder='e.g., Companies Under Our Group'
                error={errors.subtitle?.message}
                {...field}
                value={field.value ?? ''}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Sister Concern Companies */}
      <Card>
        <CardHeader>
          <div className='space-y-2'>
            <CardTitle>Sister Concern</CardTitle>
            <CardDescription>Add and manage your sister concern companies</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {companiesFields.length === 0 ? (
            <div className='p-4 border-2 border-dashed rounded-lg text-center'>
              No sister concern companies added yet. Click the button below to add your first
              company.
            </div>
          ) : (
            <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
              {companiesFields.map((field, index) => (
                <Card key={field.id} className='relative'>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-base'>Company #{index + 1}</CardTitle>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='hover:bg-destructive/10 w-8 h-8 text-destructive'
                        onClick={() => removeCompany(index)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-5'>
                    {/* Logo Upload */}
                    <div>
                      <Label className='mb-2 font-semibold text-lg'>Logo *</Label>
                      <Controller
                        control={control}
                        name={`companies.${index}.logo`}
                        render={({ field }) => (
                          <FilePicker
                            value={field.value as string}
                            onChangeAction={(val: string | string[]) => field.onChange(val)}
                            size='small'
                          />
                        )}
                      />
                    </div>

                    {/* Company Name */}
                    <Controller
                      control={control}
                      name={`companies.${index}.name`}
                      render={({ field }) => (
                        <CustomInput
                          label='Company Name *'
                          placeholder='e.g., ABC Corporation'
                          error={errors.companies?.[index]?.name?.message}
                          {...field}
                          value={field.value ?? ''}
                        />
                      )}
                    />

                    {/* Website URL */}
                    <Controller
                      control={control}
                      name={`companies.${index}.url`}
                      render={({ field }) => (
                        <CustomInput
                          label='Website URL (Optional)'
                          placeholder='https://example.com'
                          error={errors.companies?.[index]?.url?.message}
                          prefix={<ExternalLink className='w-4 h-4' />}
                          {...field}
                          value={field.value ?? ''}
                        />
                      )}
                    />

                    {/* Description */}
                    <div className='space-y-2'>
                      <Label>Description (Optional)</Label>
                      <Controller
                        control={control}
                        name={`companies.${index}.description`}
                        render={({ field }) => (
                          <Textarea
                            placeholder='Brief description of the company...'
                            className='resize-none'
                            rows={3}
                            {...field}
                            value={field.value ?? ''}
                          />
                        )}
                      />
                      {errors.companies?.[index]?.description && (
                        <p className='text-destructive text-xs'>
                          {errors.companies[index]?.description?.message}
                        </p>
                      )}
                    </div>

                    {/* Active Status */}
                    <div className='flex justify-between items-center'>
                      <div className='space-y-0.5'>
                        <Label>Active Status</Label>
                        <p className='text-muted-foreground text-xs'>
                          Display this company on the website
                        </p>
                      </div>
                      <Controller
                        control={control}
                        name={`companies.${index}.isActive`}
                        render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {companiesFields.length < 10 && (
            <AddItemButton
              onClick={() =>
                appendCompany({
                  name: '',
                  logo: '',
                  url: '',
                  description: '',
                  isActive: true
                })
              }
              label='Add Company'
              className='mt-4'
            />
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className='flex justify-end gap-3'>
        <Button type='submit' disabled={isSubmitting} size='lg'>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default SisterConcern
