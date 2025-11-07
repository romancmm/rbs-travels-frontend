'use client'

import { revalidateTags } from '@/action/data'
import FileUploader from '@/components/common/FileUploader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const LogoManagement = ({ settingsKey, initialValues, refetch }: TProps) => {

  console.log('siteConfig :>> ', initialValues);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ...initialValues,
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      }
    }
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
      <div className='flex gap-6'>
        <Card title='Media'>
          <CardHeader>
            <CardTitle className='capitalize'>
              <label>
                Logo <span className='text-xs'>(Default)</span>
              </label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center gap-2 __min-w-48'>
              <Controller
                control={control}
                name='logo.default'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  // size='large'
                  />
                )}
              />
              <span className='text-xs'>Max height 120px</span>
              {errors.logo?.default && (
                <span className='text-red-500 text-xs'>{errors.logo.default.message}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card title='Media'>
          <CardHeader>
            <CardTitle className='capitalize'>
              <label>
                Logo <span className='text-xs'>(Dark)</span>
              </label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center gap-2 __min-w-48'>
              <Controller
                control={control}
                name='logo.dark'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  />
                )}
              />
              <span className='text-xs'>Max height 120px</span>
              {errors.logo?.dark && (
                <span className='text-red-500 text-xs'>{errors.logo.dark.message}</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card title='Media'>
          <CardHeader>
            <CardTitle className='capitalize'>
              <label>Favicon</label>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col justify-center gap-2 __min-w-48'>
              <Controller
                control={control}
                name='favicon'
                render={({ field }) => (
                  <FileUploader
                    value={field.value || ''}
                    onChangeAction={field.onChange}
                    multiple={false}
                    maxAllow={1}
                  />
                )}
              />
              <span className='text-xs'>48x48 px</span>
              {errors.favicon && (
                <span className='text-red-500 text-xs'>{errors.favicon.message}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type='submit'>
        {isSubmitting ? 'Submitting...' : initialValues ? 'Update Settings' : 'Save Settings'}
      </Button>
    </form>
  )
}

export default LogoManagement
